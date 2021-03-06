import {Component, ViewChild, OnInit} from '@angular/core';
import {Router}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {RestController} from "../common/restController";
import  {OperacionSave, OperacionPrint} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";
import {Fecha} from "../utils/pipe";
import {NgSwitch, NgSwitchWhen, Control, Validators} from "@angular/common";
import {ControllerBase} from "../common/ControllerBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {MOperacion} from "./MOperacion";
import {Tooltip} from "../utils/tooltips/tooltips";
import {galeriaComponent, IGaleriaData} from "./galeria/galeriaFolder";


declare var SystemJS:any;
declare var jQuery:any;
declare var moment:any;

@Component({
    selector: 'operacion',
    templateUrl: SystemJS.map.app+'/operacion/index.html',
    styleUrls: [SystemJS.map.app+'/operacion/style.css'],
    providers: [TranslateService],
    directives: [OperacionSave, Xeditable, Filter, OperacionPrint, NgSwitch, NgSwitchWhen,Tooltip,galeriaComponent],
    pipes: [TranslatePipe]
})
export class Operacion extends ControllerBase implements OnInit {

    public typeView=2;
    public dataSelect:any = {};
    public MONEY_METRIC_SHORT:string = "";
    public AUTOMATIC_RECHARGE_PREF="";
    public commentDelete:Control;
    private viewVersion = 'view::16';

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('OP', '/operations/',router, http, toastr, myglobal, translate);
    }

    ngOnInit() {
        this.initModel();
        this.initViewOptions();
        this.initGlobalData();

        this.MONEY_METRIC_SHORT = this.myglobal.getParams('MONEY_METRIC_SHORT');
        this.AUTOMATIC_RECHARGE_PREF = this.myglobal.getParams('AUTOMATIC_RECHARGE_PREF');
        this.commentDelete = new Control(null,Validators.required);

        if (this.model.permissions['list']) {

            let start = moment().startOf('month').format('DD-MM-YYYY');
            let end = moment().endOf('month').add('1','day').format('DD-MM-YYYY');

            this.where="&where="+encodeURI("[['op':'ge','field':'dateCreated','value':'"+start+"','type':'date'],['op':'le','field':'dateCreated','value':'"+end+"','type':'date']]");
            if (localStorage.getItem(this.viewVersion))
                this.view = JSON.parse(localStorage.getItem(this.viewVersion));
            this.ordenView();
            this.loadData();
        }
    }
    initGlobalData(){
        let that = this;
        this.myglobal.dataOperation.valueChanges.subscribe(
            (data:Object)=>{
                if(that.dataList && that.dataList.list)
                {
                    let index = that.dataList.list.findIndex(obj => obj.id == data['id']);
                    if(index!=-1)
                        that.dataList.list.splice(index,1);
                }
                if(data && typeof data == 'object'){
                    that.assignData(data);
                }
            }
        )
    }

    initModel() {
        this.model= new MOperacion(this.myglobal);

    }
    onPatchDelete(event = null, id) {
        if (event)
            event.preventDefault();

        let body={};
        let that= this;
        body['comment']=this.commentDelete.value+'-----------------'+(this.dataSelect.comment || '');

        let successCallback= response => {
            Object.assign(that.dataSelect, response.json());
            this.httputils.onDelete(this.endpoint + id, id, this.dataList.list, this.error);
        }
        this.httputils.doPut(this.endpoint+id,JSON.stringify(body),successCallback,this.error);
    }


    initViewOptions() {
        this.viewOptions["title"] = 'Operaciones';
        this.viewOptions["buttons"] = [];
        this.viewOptions["actions"] = {};

        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.add && this.model.permissions.viewAdd,
            'title': 'Agregar',
            'class': 'btn text-green btn-box-tool',
            'icon': 'fa fa-plus',
            'callback':(event:Event)=>{
                event.preventDefault();
                jQuery('#'+this.model.paramsSave.idModal).modal('show');
            }
        });
        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.filter && this.model.permissions.list,
            'title': 'Filtrar',
            'class': 'btn text-blue btn-box-tool',
            'icon': 'fa fa-filter',
            'callback':(event:Event)=>{
                event.preventDefault();
                jQuery('#'+this.model.paramsSearch.idModal).modal('show');
            }
        });
        // <button [attr.title]="viewDelete?'Ocultar eliminados':'Ver eliminados'" (click)="loadViewDelete($event)">

        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.list && this.model.permissions.viewDelete,
            'title': ()=>{
                return this.viewDelete?'Ocultar eliminados':'Ver eliminados';
            },
            'class':  ()=>{
                if(!this.viewDelete)
                    return 'btn text-grey btn-box-tool ';
                return 'btn text-red btn-box-tool';
            },
            'icon': 'fa fa-trash',
            'callback':(event:Event)=>{
                event.preventDefault();
                this.viewDelete=!this.viewDelete;
                this.loadData();
            }
        });
        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.list,
            'title': 'Actualizar',
            'class': 'btn text-blue btn-box-tool',
            'icon': 'fa fa-refresh',
            'callback':(event:Event)=>{
                event.preventDefault();
                this.loadData();
            }
        });



        this.viewOptions.actions.delete = {
            'title': 'Eliminar',
            'visible': this.model.permissions.delete,
            'message': 'Estás seguro que deseas eliminar la operación con del vehículo ',
            'keyAction': 'vehiclePlate'
        };

        this.viewOptions.actions.print = {
            'visible': this.model.permissions.print,
        };

        this.viewOptions.actions.automatic = {
            'visible': this.model.permissions.automatic,
        };

        this.viewOptions.actions.pending = {
            'visible': this.myglobal.existsPermission('PEND_LIST'),
        };

        this.viewOptions.actions.image = {
            'visible': this.model.permissions.image,
            'server':this.myglobal.getParams('SERVER_IMAGE')
        };


        if(this.model.permissions.update){
            this.viewOptions.actions.edit = {
                'visible': this.model.permissions.update,
                'title':'editar',
                'modal':this.myglobal.objectInstance['OP'].idModal,
            };
        }
        this.viewOptions.actions.close = {
            'visible': this.model.permissions.update && this.model.permissions.close,
            'title':'Finalizar operación',
        };


    }
    private _getUrlPend(data){
        return "#/operacion/pendiente?where=[['op':'eq','field':'id','value':"+data.pendingId+"]]";
    }

    @ViewChild(OperacionPrint)
    operacionPrint:OperacionPrint;

    public onPrint(data) {
        if (this.operacionPrint)
            this.operacionPrint.data = data
    }

    get getUrl(){
        return localStorage.getItem('urlAPI')
                + this.endpoint
                + '?access_token=' + localStorage.getItem('bearer')
                + '&tz=' + (moment().format('Z')).replace(':', '')
                + this.where
                + '&lands=true';
    }

    public PrintAutomatic:string = "";

    onEditableWeight(field, data, value, endpoint):any {
        let cond = this.myglobal.getParams('PesoE>PesoS');
        let peso = parseFloat(value);
        let that = this;
        if (
            peso > 0.0 &&
            (
                (field == 'weightOut' && cond == "true" && data.weightIn >= peso) ||
                (field == 'weightIn' && cond == "true" && peso >= data.weightOut) ||
                (cond != "true")
            )
        ) {
            let json = {};
            json[field] = parseFloat(value);
            let body = JSON.stringify(json);
            let error = err => {
                that.toastr.error(err.json().message);
            };
            let successCallback = response => {
                Object.assign(data, response.json());
                if (that.toastr)
                    that.toastr.success('Actualizado con éxito', 'Notificación');
            }
            return this.httputils.doPut(endpoint + data.id, body, successCallback, error)
        }
    }






    //galeria por carpetas.
    public dataGaleria:IGaleriaData;

    galeriaFolder(id){
        let that = this;
        let server = this.myglobal.getParams('SERVER_IMAGE');
        let successCallback= response => {
             let data =  response._body.split('\n');
             that.dataGaleria = {
                    title: "Operación: "+id,
                    images:[],
                    server:server,
                    id:id,
                    selectFolder:null,
                    selectImage:null,
             };
             data.forEach(obj=>{
                 let val = obj.split('/');
                  if(val[0]){
                      that.dataGaleria.images.push({
                          folder:val[0],
                          created:val[1]

                      });
                  }


             });
            jQuery('#myModal1').modal('show');
        };
        let error = err => {
            this.waitResponse = false;
            if (that.toastr) {
                that.toastr.error('No se encontraron imagenes para esta operación');
            }
        }
        this.httputils.doGetFile(this.viewOptions.actions.image.server+id + '/file.txt',successCallback,error,true)

    }

    goTaquilla(event, companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }

    public codeReference:Control = new Control(null,Validators.required);
    onKey(event:any) {
        this.codeReference.updateValue(event.target.value);
    }
    onRechargeAutomatic(event, data,print=false) {
        let that = this;
        event.preventDefault();
        let json={};
        json['reference']=this.codeReference.value;
        let successCallback = response => {
            Object.assign(data, response.json());
            that.codeReference.updateValue(null);
            if (that.toastr)
                that.toastr.success('Pago cargado con éxito', 'Notificación');
            if(print)
                that.onPrint(data);

        }
        this.httputils.doPost('/pay/' + data.id,JSON.stringify(json),successCallback, this.error);
    }

    onKeyComment(event:any) {
        this.commentDelete.updateValue(event.target.value);
    }
    

    public view = [
        {'visible': true, 'position': 1, 'title': 'Fecha de salida', 'key': 'rechargeReferenceDate'},
        {'visible': true, 'position': 2, 'title': 'Recibo', 'key': 'rechargeReference'},
        {'visible': true, 'position': 3, 'title': 'Monto', 'key': 'rechargeQuantity'},
        {'visible': true, 'position': 4, 'title': 'Vehiculo', 'key': 'vehicle'},
        {'visible': true, 'position': 5, 'title': 'Peso de entrada', 'key': 'weightIn'},
        {'visible': true, 'position': 6, 'title': 'Peso de salida', 'key': 'weightOut'},

        {'visible': true, 'position': 7, 'title': 'Peso A. de entrada', 'key': 'pendingWeightIn'},
        {'visible': true, 'position': 8, 'title': 'Peso A. de salida', 'key': 'pendingWeightOut'},

        {'visible': true, 'position': 9, 'title': 'Descargado', 'key': 'neto'},
        {'visible': false, 'position': 10, 'title': 'Cliente', 'key': 'company'},
        {'visible': false, 'position': 11, 'title': 'Grupo', 'key': 'companyTypeName'},
        {'visible': false, 'position': 12, 'title': 'Ruta', 'key': 'route'},
        {'visible': false, 'position': 13, 'title': 'Tipo de basura', 'key': 'trash'},
        {'visible': false, 'position': 14, 'title': 'Operador', 'key': 'usernameCreator'},
        {'visible': false, 'position': 15, 'title': 'Fecha de Entrada', 'key': 'dateCreated'},
        {'visible': true, 'position': 16, 'title': 'Chofer', 'key': 'choferName'},
        {'visible': true, 'position': 17, 'title': 'Contenedor', 'key': 'containerCode'},
        {'visible': true, 'position': 18, 'title': 'Comentario', 'key': 'comment'},
        {'visible': true, 'position': 19, 'title': 'Habilitado', 'key': 'enabled'},
        {'visible': true, 'position': 20, 'title': 'Lugar', 'key': 'place'},
        {'visible': true, 'position': 21, 'title': 'Ruta automatica', 'key': 'pendingRouteReference'},

    ];
    public placeView:any={};
    setOrden(data, dir,event) {
        if(event)
           event.stopPropagation();
        if (dir == "asc") {
            let pos = data.position - 1;
            this.view.forEach(key=> {
                if (pos > 0) {
                    if (key.position == pos) {
                        key.position = pos + 1;
                    }
                    if (key.key == (data.key)) {
                        key.position = pos;
                    }
                }
            })
        }
        else {
            let pos = data.position + 1;
            this.view.forEach(key=> {
                if (pos < 12) {
                    if (key.position == pos) {
                        key.position = pos - 1;
                    }
                    if (key.key == (data.key)) {
                        key.position = pos;
                    }
                }
            })
        }
        this.ordenView();
    }

    public orderViewData = [];

    ordenView() {
        let that = this;
        that.orderViewData = [];
        for (let i = 1; i <= this.view.length; i++) {
            this.view.forEach(key=> {
                if (key['position'] == i) {
                    that.orderViewData.push(key);
                    return;
                }
            })
        }
        console.log(this.orderViewData);
        localStorage.setItem(this.viewVersion, JSON.stringify(this.view))
    }

    setVisibleView(data,event) {
        if(event)
            event.stopPropagation();
        this.view.forEach(key=> {
            if (key.key == data.key) {
                key.visible = !key.visible;
                return;
            }
        })
        localStorage.setItem(this.viewVersion, JSON.stringify(this.view))
    }

    edit(data){
        if (this.myglobal.objectInstance['OP']) {
            this.myglobal.objectInstance['OP'].loadEdit(data);
        }
    }
    
}

@Component({
    selector: 'operacion-monitor',
    templateUrl: SystemJS.map.app+'/operacion/monitor.html',
    styleUrls: [SystemJS.map.app+'/operacion/style.css'],
    directives:[Tooltip],
    pipes: [Fecha]
})
export class OperacionMonitor extends RestController implements OnInit {

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService) {
        super(http, toastr);
        this.setEndpoint('/operations/');
    }

    ngOnInit() {
        this.where = "&where="+encodeURI("[['op':'isNull','field':'weightOut']]")
        if (this.myglobal.existsPermission('165')) {
            this.max = 15;
            this.loadData();
        }
    }

    goTaquilla(event, companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }

}

