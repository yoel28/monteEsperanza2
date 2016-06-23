import {Component, EventEmitter, Input, Pipe} from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {Http} from "@angular/http";
import {RestController} from "../common/restController";
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import {Fecha} from "../utils/pipe";

@Component({
    selector: 'recarga-save',
    templateUrl: 'app/recarga/save.html',
    styleUrls: ['app/recarga/style.css'],
    directives: [SELECT_DIRECTIVES],
    outputs:['save'],
})
export class RecargaSave extends RestController{

    @Input() idModal:string;
    @Input() idVehicle:string;

    public save:any;

    form: ControlGroup;
    vehicle: Control;
    quantity: Control;
    reference: Control;
    referenceDate: Control;
    rechargeType: Control;

    rechargeTypes:any = []; //Arreglo con todos los tipos de regarga

    constructor(public http:Http,public _formBuilder: FormBuilder) {
        super(http);
        this.setEndpoint('/recharges/');
        this.getRechargeTypes();
        this.initForm();
        this.save = new EventEmitter();
    }
    ngOnInit() {
        if(this.idVehicle)
            this.vehicle.updateValue(this.idVehicle);
    }

    initForm(){

        this.quantity = new Control("", Validators.compose([Validators.required]));
        this.vehicle = new Control("", Validators.compose([Validators.required]));
        this.reference = new Control("", Validators.compose([Validators.required]));
        this.referenceDate = new Control("", Validators.compose([Validators.required]));
        this.rechargeType = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            quantity: this.quantity,
            reference: this.reference,
            referenceDate: this.referenceDate,
            vehicle: this.vehicle,
            rechargeType: this.rechargeType,
        });
    }
    setRechargeType(id){
        this.rechargeType.updateValue(id);
    }
    getRechargeTypes(){
        this.httputils.onLoadList("/type/recharges?where=[['op':'ne','field':'enabled','value':false]]",this.rechargeTypes,this.error);
    }
    submitForm(){
        let successCallback= response => {
            this.save.emit(response.json());
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }

}
@Component({
    selector: 'recarga-timeline',
    templateUrl: 'app/recarga/timeline.html',
    styleUrls: ['app/recarga/style.css'],
    inputs:['params'],
    pipes: [Fecha],
})
export class RecargaTimeLine extends RestController{

    // Formato de entrada
    // params={
    //     'offset':0,
    //     'max':5,
    //     'where':'where[["op":"eq","field":"id","value":"1"]]'
    // };

    public params:any={};

    public color= {
        'fa fa-cc-amex': 'bg-black',
        'fa fa-cc-mastercard': 'bg-blue',
        'fa fa-credit-card': 'bg-red',
        'fa fa-cc-diners-club': 'bg-dark',
        'fa fa-cc-paypal': 'bg-lime',
        'fa fa-google-wallet': 'bg-red',
        'fa fa-cc-discover': 'bg-orange',
        'fa fa-cc-stripe': 'bg-green',
        'fa fa-paypal': 'bg-yellow',
        'fa fa-cc-jcb': 'bg-violet',
        'fa fa-cc-visa': 'bg-pink',
        'fa fa-money': 'bg-violet',
        'fa fa-truck': 'bg-green',
    };
    
    constructor(public http:Http,public _formBuilder: FormBuilder) {
        super(http);
        this.setEndpoint('/recharges/');

    }
    ngOnInit() {
        this.loadData();
    }
    loadData(){
        event.preventDefault();
        this.httputils.onLoadList(this.endpoint+`?sort=id&order=desc&max=${this.params.max}&offset=${this.params.offset}`,this.dataList,this.error);
    }
    addtimeLine(){
        event.preventDefault();
        let successCallback= response => {
            response.json().list.forEach(obj=>{
                this.dataList.list.push(obj);
            });
            this.dataList.count = response.json().count;
        }
        this.params.offset+=this.params.max;
        if(this.params.offset < this.dataList.count)
            this.httputils.doGet(this.endpoint+`?sort=id&order=desc&max=${this.params.max}&offset=${this.params.offset}`,successCallback,this.error)
    }

}
