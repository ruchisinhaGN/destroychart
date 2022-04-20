import { LightningElement,wire,track,api} from 'lwc';
   //importing the Chart library from Static resources
   import chartjs from '@salesforce/resourceUrl/ChartJs'; 
   import { loadScript } from 'lightning/platformResourceLoader';
   import { ShowToastEvent } from 'lightning/platformShowToastEvent';
   //importing the apex method.
   import getLeadByStatus from '@salesforce/apex/LeadGraphController.getLeadByStatus';
   import pickListValueDynamically from '@salesforce/apex/lwcPicklistController.pickListValueDynamically';
   import { refreshApex } from '@salesforce/apex';
   export default class Chartaccount extends LightningElement {

   @track picklistVal;
  @track isRendered ;
@api  repeat = false;
    @wire(pickListValueDynamically, {customObjInfo: {'sobjectType' : 'Case'},
    selectPicklistApi: 'Status'}) selectTargetValues;
        
      selectOptionChanveValue(event){       
           this.picklistVal = event.target.value;
           this.isRendered = true;
           this.chart.data.labels.splice(0, 1);
           this.chart.data.datasets[0].data.splice(0, 1);
       }  
      @wire(getLeadByStatus, { status :'$picklistVal'}) wiredLeads({error,data})
   {
      
      if(data)
      {
        
       console.log(data);
       for(var key in data)
          {
             this.updateChart(data[key].count , data[key].label);
          }
         this.error=undefined;
      }
     else if(error)
     {
        this.error = error;
        this.accounts = undefined;
     }
   }
   chart;
   chartjsInitialized = false;
   config={
   type : 'doughnut',
   data :{
   datasets :[
   {
   data: [
   ],
   backgroundColor :[
       'rgb(255,99,132)',
       'rgb(255,159,64)',
       'rgb(255,205,86)',
       'rgb(75,192,192)',
   ],
      label:'Dataset 1'
   }
   ],
   labels:[]
   },
   options: {
       responsive : true,
   legend : {
      key: 'nested.value'
   },
   animation:{
      animateScale: true,
      animateRotate : true
   }
   }
   };
   renderedCallback()
   {
      if(this.chartjsInitialized)
     {
      return;
     }
     this.chartjsInitialized = true;
     Promise.all([
      loadScript(this,chartjs)
     ]).then(() =>{
       const ctx = this.template.querySelector('canvas.donut')
       .getContext('2d');
       this.chart = new window.Chart(ctx, this.config);

     })
     .catch(error =>{
       this.dispatchEvent(
       new ShowToastEvent({
       title : 'Error loading ChartJS',
       message : error.message,
       variant : 'error',
      }),
     );
   });
   }
   @track currentChart;
   handleClick(event){
      }
   updateChart(count,label)
   {
      
      if(this.isRendered = true){
       this.chart.data.labels.push(label);
         this.chart.data.datasets.forEach((dataset) => {
         dataset.data.push(count);
        
         });
            
            this.chart.update();
         
         }
        
     

    }


   

   

   }