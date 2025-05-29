use actix_web::{self, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{self, Deserialize, Serialize};  
use actix_files::{self, Files};
use actix_cors;
use dotenv;
use sysinfo::Disks;
use std::{env, time::Duration};
use std::sync::{Mutex, OnceLock};

const GB : u64 = 1024 * 1024 * 1024;
const MB : u64 = 1024 * 1024;

// just start one time
static GLOBAL_SYS : OnceLock< Mutex<sysinfo::System> > = OnceLock::new();

#[derive(Serialize,Deserialize)]
struct SystemInfos{
  cpu_usage:     String,
  mem_usage:     u64,
  available_mem: u64 
}

#[post("/sys_info")]
async fn info() -> impl Responder{

  let sys_mtx = GLOBAL_SYS.get_or_init(|| Mutex::new(sysinfo::System::new_all()) );
  let mut sys = sys_mtx.lock().unwrap();

  sys.refresh_cpu_usage();
 
  tokio::time::sleep(Duration::from_millis(1000)).await;
 
  sys.refresh_cpu_usage();
  sys.refresh_memory();
 
   let infos = SystemInfos{
      cpu_usage:     format!("{:.2}", sys.global_cpu_usage() ),
      mem_usage:     sys.used_memory() / MB,
      available_mem: sys.available_memory() / MB
   };

  HttpResponse::Ok().json(infos)
} 

#[derive(Serialize, Deserialize)]
struct DiskInfos{
  free_space      : u64,
  total_disk      : u64,
  available_space : u64
}

#[post("/disk_info")]
async fn disk_info() -> impl Responder{
    let disks = Disks::new_with_refreshed_list();
    let mut disk_infos = Vec::new();
 
    for disk in disks.list(){

      let infos = DiskInfos{
        free_space     : disk.available_space()   / GB,
        total_disk     : disk.total_space() / GB, 
        available_space:  disk.total_space() / GB - disk.available_space() / GB
      };

      disk_infos.push(infos);
    }

    HttpResponse::Ok().json(disk_infos)
}

#[derive(Serialize, Deserialize)]
struct Login{
  user : String,
  pass : String
}

#[post("/login")]
async fn login( data : web::Json<Login> ) -> impl Responder{
 // read user and password from .env file
  dotenv::dotenv().ok();
  let admin_user = env::var("ADMIN_USER").expect("USER not found in .env!");
  let admin_pass = env::var("ADMIN_PASS").expect("PASS not found in .env!");
  
  if data.user == admin_user && data.pass == admin_pass{  
    HttpResponse::Ok().json("Login Success!")
  } else{
     HttpResponse::Unauthorized().json("User or password is incorrect!")
  } 

}

#[actix_web::main]
async fn main() -> std::io::Result<()>{
  
  const PORT : u16 = 8000;
  println!("Server running on http://localhost:{}", PORT);

  HttpServer::new( || {
    let cors = actix_cors::Cors::default()
              .allow_any_origin()
              .allow_any_method()
              .allow_any_header();

    App::new() 
      .wrap(cors)
        .service(info)
        .service(login)
        .service(disk_info)
        .service(Files::new("/", "./build").index_file("index.html"))
        .route("/", web::get() )
    })
  .bind( ("0.0.0.0", PORT) )?
  .run()
  .await

}
