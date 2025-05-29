import './App.css';
//import "./login.css";
import React, { useEffect , useRef, useState } from 'react'; 
import ReactECharts from 'echarts-for-react';

function Login({isLoginSuccess}){

    const user = useRef("")
    const pass = useRef("")
 
    const res = async function() {
      const u = user.current.value
      const p = pass.current.value

          try {
            const res = await fetch( "/login", {
              method: "POST",
              headers: {"Content-Type" : "application/json" },
              body: JSON.stringify({ user: u.trim(), pass: p })
            })
 
            if (!res.ok)
                throw new Error("Login failed!")
              
            const data = await res.json()

            alert("Login Success")
            isLoginSuccess()

          } catch(err){
            alert(err)
          }

      }
 
    return(
      <div id='loginForm'>
        <article>
         <input type='text' ref={user} placeholder='Username' required/> 
         <input type='password' ref={pass} placeholder='Password' required/> 
         <button onClick={res}>Login</button>
        </article>
        
      </div>
    )

}

function CPUGraph( {sec, cpuData} ){
  const chartOptions = {
    title: { text: "CPU Usage" },
    tooltip: { trigger: "axis" },
   // grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    legend: { data: ["CPU Usage - %"] },
    toolbox: { feature: { saveAsImage: {} } },
    xAxis: { type: "category", boundaryGAP: false, data: sec },
    yAxis: { type: "value" /* , min: 0, max:100  */},
    series: [
       { name: "CPU Usage - %", type: "line", stack: "Total", smooth: true,  areaStyle: { color: "rgb(10, 86, 121)"  }, data: cpuData }
     ],  
    // backgroundColor: "rgb(111, 138, 13)",
     animationDuration: 1000,
     animationEasing: "cubicOut"
 }

  return(
    <div id='CPUGraph'>
      <ReactECharts option={chartOptions} style={ {width: 500} } />
    </div>
  )

}

function MEMGraph( {sec, memData, availableMEM} ){
  const chartOptions = {
    title: { text: "MEM Usage" },
    tooltip: { trigger: "axis" },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    legend: { data: ["MEM Usage - MB", "Available MEM - MB"] },
    toolbox: { feature: { saveAsImage: {} } },
    xAxis: { type: "category", boundaryGAP: false, data: sec },
    yAxis: { type: "value" /* , min: 0, max:100  */},
    series: [
       { name: "MEM Usage - MB", type: "line", smooth: true, areaStyle: {}, data: memData },
       { name: "Available MEM - MB", type: "line", smooth: true, areaStyle: {}, data: availableMEM },
     ],  
   // animationDuration: 1000,
   // animationEasing: "cubicOut"
 }

  return(
    <div id='MEMGraph'>
      <ReactECharts option={chartOptions} style={{width:500}} />
    </div>
  )

}

function DISKInfo(){

    const [data , setData] = useState([])

    useEffect( ()=> {
      const infos = async function(){
        
        try{
          const res  = await fetch( "/disk_info", { method: "POST" } )

          if (!res.ok) throw new Error("disk_info fetch is failed!")

          const data = await res.json();
          setData(data)

        } catch (err){
          alert(" disk_info fetch is failed! Message: " + err)
        }

    }
        infos()

    }, [])  

    const chartOptions = (disk) => ({
      title: { text: "Disk Info" },
      tooltip: { trigger: "axis" },
       grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      legend: { data: ["Disk Usage"] },  
      toolbox: { feature: { saveAsImage: {} } },
      xAxis: { type: "category", boundaryGAP: false, data: [new Date().toLocaleString(), new Date( Date.now() + 1000 ).toLocaleString() ] },
      yAxis: { type: "value" },
      series: [ 
         { name: "Total Disk - GB", type: "line", smooth: true,  areaStyle: {}, data: [disk.total_disk, disk.total_disk] },
         { name: "Free Space - GB", type: "line", smooth: true,  areaStyle: {}, data: [disk.free_space, disk.free_space ] },
         { name: "Available Disk - GB", type: "line", smooth: true,  areaStyle: {}, data: [disk.available_space, disk.available_space] },
       ],    
   })

    return(
      <div id='diskGraph'>
        {
          Array.isArray(data) && data.length > 0 ?
            ( data.map((disk, index) => (
              <div key={index}>
                <h1>Disk {index + 1}</h1>
                <ReactECharts option={chartOptions(disk)} /> 
              </div>
            )) )
            : 
            ( <h1> Disk infos loading... </h1> )

        }
        
      </div>
    )

}

function SYSInfo(){

  const [data, setData] = useState([])
  const [cpuData, setCPUData] = useState([])
  const [MEMData, setMEMData] = useState([])
  const [sec, setSeconds] = useState([])
  const [AvailabeMem, setAvailable] = useState([])

  useEffect( ()=> {
       
     const GetSysInfo = async function(){
        try{
          const res  = await fetch("/sys_info", {method: "POST"})
          const info = await res.json()
          setData(info)
          setCPUData( prev => [...prev.slice(-19), info.cpu_usage] )
          const toGB = (val) => Number(parseFloat( val / 1024.0).toFixed(2)) // convert val to GB
          setMEMData( prev => [...prev.slice(-19),  (info.mem_usage) ] )
          setAvailable( prev => [...prev.slice(-19),  (info.available_mem) ] )
          setSeconds( prev => [...prev.slice(-19), new Date().toLocaleTimeString()] )
        }catch (err){
          console.error("sysInfo error: ", err)
          return
        }
     }

     GetSysInfo()
  
     const interval = setInterval(() => {
        GetSysInfo()
     }, 1000);

     return () => clearInterval(interval)

  }, [])
 
  
   return(
      <div> 
         <DISKInfo />

        <div id='chart'>
            <CPUGraph sec={sec} cpuData={cpuData} />
            <MEMGraph sec={sec} memData={MEMData} availableMEM={AvailabeMem} />
        </div>

      </div>
   )

}
  
function Main(){
 
  const [ logged, setLogged ] = useState(false)

  return(
   <div>  
     { logged ? <SYSInfo /> : <Login isLoginSuccess={ () => setLogged(true) } /> }  
   </div>  
  )

}

export default Main