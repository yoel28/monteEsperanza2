import {Component, OnInit,AfterViewInit} from '@angular/core';
import {globalService} from "../common/globalService";
import {BaseView} from "../utils/baseView/baseView";
import {MPlace} from "./MPlace";

declare var SystemJS:any;
@Component({
    selector: 'place',
    templateUrl:SystemJS.map.app+'/utils/baseView/base.html',
    styleUrls: [SystemJS.map.app+'/utils/baseView/style.css'],
    directives: [BaseView],
})
export class Place implements OnInit,AfterViewInit{

    public instance:any={};
    public paramsTable:any={};
    public model:any;
    public viewOptions:any={};

    constructor(public myglobal:globalService) {}
    
    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadParamsTable();
    }
    
    ngAfterViewInit():any {
        this.instance = {
            'model':this.model,
            'viewOptions':this.viewOptions,
            'paramsTable':this.paramsTable
        };
    }
    
    initModel():any {
        this.model= new MPlace(this.myglobal);
    }
    
    initViewOptions() {
        this.viewOptions["title"] = 'Lugares';
    }
    
    loadParamsTable(){
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar el lugar : ',
            'keyAction':'title'
        };
        this.paramsTable.actions.duplicate = {
            permission:this.model.permissions.add,
            idModal:this.model.paramsSave.idModal,
            icon:'fa fa-files-o',
            title:'Duplicar',
            callback:(bv:BaseView,data:any)=>{
                bv.save.resetForm();

                bv.save.getDataSearch({id:data.routeId,detail:data.routeReference,placesPosible:data.placesPosible},'route');

                bv.save.setValueSelect(data.code,'code');
                bv.save.setValueSelect(data.title,'title');

            }
        };



    }
}