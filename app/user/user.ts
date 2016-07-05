import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import {RestController} from "../common/restController";
import {globalService} from "../common/globalService";
import {UserSave} from "./methods";
import {Search} from "../utils/search/search";
import {EmpresaSave} from "../empresa/methods";
import {Xeditable} from "../common/xeditable";
import {ToastsManager} from "ng2-toastr/ng2-toastr";

@Component({
    selector: 'user',
    templateUrl: 'app/user/index.html',
    styleUrls: ['app/user/style.css'],
    directives: [UserSave,Search,EmpresaSave,Xeditable],
})
export class User extends RestController{
    
    public userSelect:string;

    constructor(public router: Router,public http: Http,public myglobal:globalService,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/users/');
    }
    ngOnInit(){
        this.validTokens();
        this.loadData();
    }
    public rules={
        'id': {'type':'text','disabled':true,'display':false,'title':'id' },
        'username':{'type':'text','display':null,'title':'Nombre de usuario' },
        'name':{'type':'text','display':null,'title':'nombre' },
        'email':{'type':'email','display':null,'title':'Correo' },
        'password':{'type':'password','display':null,'title':'Contrasena' },
        'phone':{'type':'number','display':null,'title':'Telefono' },
    }

    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    goTaquilla(companyRuc:string)
    {
        let link = ['TaquillaSearh', {search:companyRuc}];
        this.router.navigate(link);
    }
    goTimeLine(companyRuc:string)
    {
        let link = ['EmpresaTimeLine', {ruc:companyRuc}];
        this.router.navigate(link);
    }


    public searchEmpresa={
        title:"Empresa",
        idModal:"searchEmpresa",
        endpointForm:"/search/companies/",
        placeholderForm:"Ingrese el RUC de la empresa",
        labelForm:{name:"Nombre: ",detail:"RUC: "},
    }

    assignCompany(data){
        let index = this.dataList.list.findIndex(obj => obj.id == this.userSelect);
        this.onPatch('company',this.dataList.list[index],data.id);
    }
    assignUser(data){
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }
   

}