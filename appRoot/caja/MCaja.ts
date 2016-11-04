import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MCaja extends ModelBase{
    public rules={};
    constructor(public myglobal:globalService){
        super('CAJA','/containers/',myglobal);
        this.initModel();
    }
    
    modelExternal() {}

    initRules(){
        this.rules['name']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'name',
            'title': 'Nombre',
            'placeholder': 'Ingrese Nombre',
        }
        this.rules['telefono']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'telefono',
            'title': 'Teléfono',
            'placeholder': 'Ingrese teléfono',
        }
        this.rules['direccion']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'direccion',
            'icon': 'fa fa-list',
            'title': 'Dirección',
            'placeholder': 'Ingrese Dirección',
        }
        this.rules['email']={
            'type': 'text',
            'required':false,
            'email':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'email',
            'icon': 'fa fa-list',
            'title': 'Correo',
            'placeholder': 'Ingrese el correo',
        }
        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar caja";
        this.paramsSearch.placeholder="Ingrese caja";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar caja"
    }
    initRuleObject() {
        this.ruleObject.title="Caja";
        this.ruleObject.placeholder="Ingrese caja";
        this.ruleObject.key="caja";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}