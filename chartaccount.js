import { LightningElement,wire, track, api} from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJs';
import {loadScript} from 'lightning/platformResourceLoader';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getLeadByStatus from '@salesforce/apex/LeadGraphController.getLeadByStatus';

import pickListValueDynamically from '@salesforce/apex/lwcPicklistController.pickListValueDynamically';

export default class Chartaccount extends LightningElement {
    @api Users;
    @track picklistVal;
    @track isRendered;
    @api repeat = false;
    @track arraylength;
    @track alldata;
    @track indexpicklistvalue;
    @track selectTargetValues;
    @wire(pickListValueDynamically, {
        customObjInfo: {
            'sobjectType': 'Case'
        },
        selectPicklistApi: 'Status'
    }) selectTargetValues;
  
    selectOptionChanveValue(event) {

        this.picklistVal = event.target.value;
        this.isRendered = true;
        var maindata = this.alldata;
        this.chart.data.labels.splice(0, this.arraylength);
        this.chart.data.datasets[0].data.splice(0, this.arraylength);

        chart.update();
    }
    @wire(getLeadByStatus, {
        status: '$picklistVal',
        Users:'$Users'
    }) wiredLeads({
        error,
        data
    }) {

        if (data) {
            
            var size = data.length;
            this.arraylength = size;
            this.alldata = data;
           
            for (var key in data) {
                this.updateChart(data[key].count, data[key].label);
            }
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.accounts = undefined;
        }
    }
    chart;
    chartjsInitialized = false;
    config = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [],
                backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001F3F", "#39CCCC", "#01FF70", "#85144B", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
             
                label: 'Dataset 1'
            }],
            labels: []
        },
        options: {
            responsive: true,
            legend: {
                key: 'nested.value',
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };
    renderedCallback() {
        if (this.chartjsInitialized) {
            const picklistindexvalue = this.selectTargetValues.data[0].custFldvalue;  
            this.indexpicklistvalue=picklistindexvalue;
            this.picklistVal= this.indexpicklistvalue;
           
            return;
        }
        this.chartjsInitialized = true;
        Promise.all([
                loadScript(this, chartjs)
            ]).then(() => {
                const ctx = this.template.querySelector('canvas.donut')
                    .getContext('2d');
                this.chart = new window.Chart(ctx, this.config);

            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading ChartJS',
                        message: error.message,
                        variant: 'error',
                    }),
                );
            });
    }
    @track currentChart;
    handleClick(event) {
       


    }
    updateChart(count, label) {

        if (this.isRendered = true) {
            this.chart.data.labels.push(label);
            this.chart.data.datasets.forEach((dataset) => {
                dataset.data.push(count);
                this.datachart = this.count;
            });

            this.chart.update();

        }

    }

}