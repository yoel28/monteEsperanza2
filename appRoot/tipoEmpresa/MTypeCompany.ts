import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MTypeCompany extends ModelBase{
    public rules={};
    constructor(public myglobal:globalService){
        super('GROUP','/type/companies/',myglobal);
        this.initModel();
    }

    modelExternal() {}
    
    initRules(){

        this.rules['title']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'title',
            'title': 'Título',
            'placeholder': 'Título',
        };
        this.rules['code']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'code',
            'title': 'Código',
            'placeholder': 'Código',
        };
        this.rules['free']={
            'type': 'boolean',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value':true,'text': 'Libre', 'class': 'btn btn-sm btn-green'},
                {'value':false,'text': 'Pago', 'class': 'btn btn-sm btn-blue'},
            ],
            'key': 'free',
            'title': 'Libre',
            'placeholder': 'Seleccione si es libre',
        };
        this.rules['credit']={
            'type': 'boolean',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'disabled':'data.free?false:true',
            'source': [
                {'value':true,'text': 'Credito', 'class': 'btn btn-sm btn-green'},
                {'value':false,'text': 'Contado', 'class': 'btn btn-sm btn-blue'},
            ],
            'key': 'credit',
            'title': 'Tipo de grupo',
            'placeholder': 'Seleccione el tipo de grupo',
        };
        this.rules['icon']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value': 'fa fa-building', 'text':'building'},
                {'value': 'fa fa-building-o', 'text': 'building-o'},
                {'value': 'fa fa-home', 'text': 'home'},
            ],
            'key': 'icon',
            'title': 'Icono',
            'placeholder': 'Seleccione un icono',
        };
        this.rules = Object.assign({},this.rules,this.getRulesDefault());
        this.rules['detail'].required=true;
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar grupo";
        this.paramsSearch.placeholder="Ingrese grupo";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar grupo"
    }
    initRuleObject() {
        this.ruleObject.title="Grupo";
        this.ruleObject.placeholder="Ingrese grupo";
        this.ruleObject.key="companyType";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}