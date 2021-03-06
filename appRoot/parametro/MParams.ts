import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MParams extends ModelBase{

    constructor(public myglobal:globalService){
        super('PARAM','/params/',myglobal);
        this.initModel();
    }
    modelExternal() {}
    initRules(){
        this.rules['key']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'key',
            'title': 'Clave',
            'placeholder': 'Clave',
        };

        this.rules['value']={
            'type': 'textarea',
            'showbuttons':true,
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'value',
            'title': 'Valor',
            'placeholder': 'Valor',
        };
        this.rules['type']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value': 'String', 'text': 'String'},
                {'value': 'Long', 'text': 'Long'},
                {'value': 'Double', 'text': 'Double'},
                {'value': 'Date', 'text': 'Date'},

            ],
            'key': 'type',
            'title': 'Tipo',
            'placeholder': 'Selecccione un Tipo',
        };

        this.mergeRules();

    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar parámetro";
        this.paramsSearch.placeholder="Ingrese el parámetro";
        this.paramsSearch.label.title="Codigo: ";
        this.paramsSearch.label.detail="Detalle: "
    }
    initParamsSave() {
        this.paramsSave.title="Agregar parámetro"
    }
    initRuleObject() {
        this.ruleObject.title="Parámetro";
        this.ruleObject.placeholder="Ingrese el parámetro";
        this.ruleObject.key="param";
        this.ruleObject.keyDisplay="paramKey";
        this.ruleObject.code="paramId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}
