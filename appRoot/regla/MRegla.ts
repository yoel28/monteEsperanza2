import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MRegla extends ModelBase{
    public rules={};
    constructor(public myglobal:globalService){
        super('RULE','/rules/',myglobal);
        this.initModel();
    }
    initRules(){
        this.rules['rule']={
            'type':'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key':'rule',
            'icon': 'fa fa-key',
            'title':'Regla',
            'placeholder':'Regla',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        };
        this.rules['name']={
            'type':'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key':'name',
            'icon': 'fa fa-list',
            'title':'Nombre',
            'placeholder':'Nombre',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        };
        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar regla";
        this.paramsSearch.placeholder="Ingrese codigo de la regla";
    }
    initRuleObject() {
        this.ruleObject.title="Regla";
        this.ruleObject.placeholder="Ingrese codigo de la regla";
        this.ruleObject.key="rule";
    }
    initRulesSave() {
        let _rules = Object.assign({},this.rules);
        delete _rules.detail;
        delete _rules.enable;
        this.ruleSave = Object.assign({},_rules);
    }
}