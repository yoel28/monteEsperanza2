import { Http} from '@angular/http';
import  {ControlGroup,} from '@angular/common';
import {HttpUtils} from "./http-utils";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {OnInit} from "@angular/core";


export class RestController implements OnInit {

    dataList:any = [];
    httputils:HttpUtils;
    endpoint:string;
    offset=0;
    max=5;
    sort="";//name field.
    order="";//asc o desc
    page:any=[];
    where:string="";

    constructor(public http: Http,public toastr?: ToastsManager) {
        this.httputils = new HttpUtils(http,toastr || null);
    }
    ngOnInit(){

    }
    setEndpoint(endpoint:string){
        this.endpoint=endpoint;
    }

    error= err => {
        if(this.toastr)
            this.toastr.error(err.json().message);
        console.log(err);
    }
    getOffset(offset?){
        if(typeof offset ==='number')
            this.offset=this.max*(offset-1);
        else{
            if(offset=='<')
                this.offset=this.offset-this.max;
            else if (offset=='<<')
                this.offset=0;
            else if(offset=='>')
                this.offset=this.offset+this.max;
            else if (offset=='>>')
                this.offset=(Math.ceil(this.dataList.count/this.max)-1)*this.max;
            else
                this.offset=0;
        }
    }
    loadPager(list){
        list['page']=[];
        if(list.count && list.count > 0)
        {
            let initPage=Math.trunc((this.offset+this.max)/(this.max*5))*5;
            let count=0;
            let maxPage = Math.ceil(list.count/this.max);
            if(initPage > 1)
                list.page.push('<<','<',initPage);
            while(count < 5 && maxPage > (initPage+count) ){
                count++;
                list.page.push(initPage+count)
            }
            if(maxPage > (initPage+count))
                list.page.push('>','>>');
        }
    }

    loadData(offset?){
        let that = this;
        this.getOffset(offset);
        this.httputils.onLoadList(this.endpoint+"?max="+this.max+"&offset="+this.offset+this.where+(this.sort.length>0?'&sort='+this.sort:'')+(this.order.length>0?'&order='+this.order:''),this.dataList,this.max,this.error).then(
            response=>{
                that.loadPager(that.dataList);
            },error=>{
                console.log("error");
            }
        );
    };
    onloadData(endpoint?,list?,offset?){
        let that = this;
        this.getOffset(offset);
        this.httputils.onLoadList((endpoint || this.endpoint)+"?max="+this.max+"&offset="+this.offset+this.where+(this.sort.length>0?'&sort='+this.sort:'')+(this.order.length>0?'&order='+this.order:''),(list || this.dataList),this.max,this.error).then(
            response=>{
                that.loadPager(list || that.dataList);
            },error=>{
                console.log("error");
            }
        );
    };
    onUpdate(event,data){
        event.preventDefault();
        if(data[event.target.accessKey]!=event.target.innerHTML){
            //data[event.target.accessKey] = event.target.innerHTML;
            let json = {};
            json[event.target.accessKey] = event.target.innerHTML;
            let body = JSON.stringify(json);
            this.httputils.onUpdate(this.endpoint+data.id,body,data,this.error);
        }
    }
    onDelete(event=null,id){
        if(event)
            event.preventDefault();
        this.httputils.onDelete(this.endpoint+id, id, this.dataList.list, this.error);
    }
    onSave(data:ControlGroup){
        let body = JSON.stringify(data.value);
        this.httputils.onSave(this.endpoint,body,this.dataList.list,this.error);
    }
    onPatch(field,data,value?){
        let json = {};
        json[field] = value?value:!data[field];
        let body = JSON.stringify(json);
        return (this.httputils.onUpdate(this.endpoint + data.id, body, data, this.error));
    }
    onLock(field,data){
        let json = {};
        json[field] = !data[field];
        let body = JSON.stringify(json);
        return (this.httputils.onUpdate("/lock"+this.endpoint + data.id, body, data, this.error));
    }
    onEditable(field,data,value,endpoint){
        let json = {};
        if( typeof data[field] === "number" )
            value=parseFloat(value);
        json[field] = value;
        let body = JSON.stringify(json);
        let error = err => {
            this.toastr.error(err.json().message);
        };
        return (this.httputils.onUpdate(endpoint + data.id, body, data, error));
    }
    onEditableRole(field,data,value,endpoint){
        let json = {};
        json[field] = value;
        let body = JSON.stringify(json);
        let error = err => {
            this.toastr.error(err.json().message);
        };
        let successCallback= response => {
            if(this.toastr)
                this.toastr.success('Guardado con éxito','Notificacion')
        }
        return (this.httputils.doPost(endpoint, body,successCallback, error));
    }
    assignData(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }
}
