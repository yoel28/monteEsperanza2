import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {HttpUtils} from "../common/http-utils";
import { Ng2Highcharts } from 'ng2-highcharts/ng2-highcharts';
import {RecargaTimeLine} from "../recarga/methods";
import match = require("core-js/fn/symbol/match");
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";


@Component({
    selector: 'home',
    templateUrl: 'app/dashboard/dashboard.html',
    styleUrls: ['app/dashboard/dashboard.css'],
    directives: [Ng2Highcharts,RecargaTimeLine],
})
export class Dashboard extends RestController{
    dataCamion:any = [];
    httputils:HttpUtils;
    endpoint:string;

    public paramsTimeLine={
        'offset':0,
        'max':3,
        'ruc':''
    };
    dataArea={
        chart: {
          type: 'area',
         },
        xAxis: {
            categories: [],
        },
        yAxis:{
            title:{
                text:"Cantidad",
            },
        },
        credits:{
            enabled:false
        },
        series: [],
        title : { text : 'Uso del vertedero' },
    };

    constructor(public router: Router,http: Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.validTokens();
        this.getPlot1();
        this.getPlot2();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }

    goTaquilla(){
        let link = ['Taquilla', {}];
        this.router.navigate(link);
    }

    dataPlot:any=[];
    getPlot1(){
        let successCallback= response => {
            Object.assign(this.dataArea.series, response.json().series);
            if(response.json().categories)
                Object.assign(this.dataArea.xAxis.categories, response.json().categories);
        }
        this.httputils.doGet("/dashboards/plot/1/2016",successCallback,this.error)
    }
    getPlot2(){
        let successCallback= response => {
            Object.assign(this.dataPlot, response.json());
            this.dataPlot.total=0;
            this.dataPlot.forEach(val=>{
                if(val.quantity > 0)
                    this.dataPlot.total+=val.quantity;
                else val.quantity *= -1;
            })
        }
        this.httputils.doGet("/dashboards/plot/2/2016",successCallback,this.error)
    }

}


