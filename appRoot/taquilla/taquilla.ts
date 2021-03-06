import {Component, ViewChild, OnInit} from '@angular/core';
import { Router,RouteParams }           from '@angular/router-deprecated';
import  {FormBuilder} from '@angular/common';
import { Http } from '@angular/http';
import {RecargaSave} from "../recarga/methods";
import {RestController} from "../common/restController";
import {Fecha} from "../utils/pipe";
import {globalService} from "../common/globalService";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {OperacionPrint} from "../operacion/methods";
import moment from "moment/moment";
import{Tooltip} from "../utils/tooltips/tooltips";
import {FindRangeDate} from "../utils/components/findRangeDate/findRangeDate";
declare var jQuery:any;
declare var SystemJS:any;

@Component({
    selector: 'taquilla',
    pipes: [Fecha],
    templateUrl: SystemJS.map.app+'/taquilla/index.html',
    styleUrls: [SystemJS.map.app+'/taquilla/style.css'],
    directives:[RecargaSave,OperacionPrint,Tooltip,FindRangeDate]
})
export class Taquilla extends RestController implements OnInit{
    public dataCompany:any = {};
    public dataSelect:any = {};
    public dataCompanies:any = {};
    public dataTotal:any = {};
    public permissions={};
    public search;
    public MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
    public MONEY_METRIC=this.myglobal.getParams('MONEY_METRIC');
    public AUTOMATIC_RECHARGE_PREF = this.myglobal.getParams('AUTOMATIC_RECHARGE_PREF');

    public configId = moment().valueOf();

    constructor(public params:RouteParams,public router: Router,http: Http,_formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
    }
    ngOnInit(){
        this.permissions['automatic'] = this.myglobal.existsPermission('OP_AUTOMATIC');
        if(this.params.get('search'))
        {
            if(this.myglobal.existsPermission('80'))
                this.getCompany(this.params.get('search'));
        }
    }
    getCompany(companyId:string){
        let that=this;
        if(this.myglobal.existsPermission('80')){
            let successCallback= response => {
                Object.assign(this.dataCompany, response.json());
                that.loadDataRecargas();
                that.loadDataTotal();
            }
            this.dataCompanies = {};
            this.httputils.doGet("/companies/"+companyId,successCallback,this.error)
        }
    }
    public  total_client={};
    loadDataTotal(date?){

            let tempWhere =[];
            tempWhere.push({'op':'eq','field':'company.id','value':this.dataCompany.id});
            if(date && date.value && date.value.start && date.value.end)
            {
                tempWhere.push({'value':date.value.start,'field':'dateCreated','type':'date','op':'ge'});
                tempWhere.push({'value':date.value.end,'field':'dateCreated','type':'date','op':'le'});
            }
            this.where = "&where="+encodeURI(JSON.stringify(tempWhere).split('{').join('[').split('}').join(']'));
            this.onloadData("/total/recharges",this.total_client);

    };

    
    loadDataRecargas(date?){
        if(this.myglobal.existsPermission('109')) {
            this.max=5;
            this.offset = 1;
            this.endpoint = "/search/recharges";
            let tempWhere =[];
            tempWhere.push({'op':'eq','field':'company.id','value':this.dataCompany.id});
            if(date && date.value && date.value.start && date.value.end)
            {
                tempWhere.push({'value':date.value.start,'field':'dateCreated','type':'date','op':'ge'});
                tempWhere.push({'value':date.value.end,'field':'dateCreated','type':'date','op':'le'});
            }
            this.where = "&where="+encodeURI(JSON.stringify(tempWhere).split('{').join('[').split('}').join(']'));
            this.loadData();
        }
    };

    getCompanies(companies:string,offset=1){
        if(this.myglobal.existsPermission('80')) {
            this.max=10;
            this.dataCompany={};
            this.where="";
            this.onloadData("/search/companies/"+ companies,this.dataCompanies,offset);
        }
    }
    assignRecarga(data){
        let saldo=data.quantity+this.dataCompany.balance;
        if( (this.dataCompany.debt*-1) <= saldo)
        {
            saldo= saldo + this.dataCompany.debt;
            this.dataCompany.debt=0;
        }
        this.dataCompany.balance=saldo;
        this.dataList.count+=1;
        this.dataList.list.unshift(data);
    }
    onPrint(event){
        event.preventDefault();
        var printContents = document.getElementById("taquilla").innerHTML;
        var popupWin = window.open('', '_blank');
        popupWin.document.open();
        popupWin.document.write('<body onload="window.print()">' + printContents + '</body>');
        popupWin.document.head.innerHTML = (document.head.innerHTML);
        popupWin.document.close();

    }

    exportCSV(){
        jQuery("#content").tableToCSV();
    }
    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "-";
    }

    @ViewChild(OperacionPrint)
    operacionPrint:OperacionPrint;
    onPrintOperation(data){
        let successCallback= response => {
            if(this.operacionPrint)
                this.operacionPrint.data=response.json();
        };
        this.httputils.doGet('/operations/'+data.operationId,successCallback,this.error)
    }
    //recarga automatica
    public codeReference="";
    onRechargeAutomatic(event, data) {
        let that = this;
        event.preventDefault();
        let json={};
        json['reference']=this.codeReference.length>0? this.codeReference: (this.AUTOMATIC_RECHARGE_PREF+data.reference);
        let successCallback = response => {
            Object.assign(data, response.json());
            if (that.toastr)
                that.toastr.success('Pago cargado con éxito', 'Notificación');

        }
        this.httputils.doPost('/pay/' + data.operationId,JSON.stringify(json),successCallback, this.error);
    }
    onKey(event:any) {
        this.codeReference = event.target.value;
    }
}



