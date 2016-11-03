import {globalService} from "./globalService";

declare var moment:any;

export abstract class ModelBase{

    public prefix = "DEFAULT";
    public endpoint = "DEFAULT_ENDPOINT";
    public permissions:any = {};
    public paramsSearch:any = {};
    public paramsSave:any = {};
    public ruleObject:any={};
    public rulesSave:any={};
    public msg:any={};

    public configId = moment().valueOf();
    private rulesDefault:any = {};

    constructor(prefix,endpoint,public myglobal:globalService){
        this.prefix = prefix;
        this.endpoint = endpoint;

        this._initModel();
    }

    private _initModel(){
        this._initMsg();
        this._initPermissions();
        this._initRules();
        this._initParamsSearch();
        this._initParamsSave();
        this._initRuleObject();
    }
    public initModel(){
        this.initPermissions();
        this.initRules();
        this.initRulesSave();
        this.initParamsSearch();
        this.initParamsSave();
        this.initRuleObject();
    }

    private _initMsg(){
        this.msg.error="El campo contiene errores";
        this.msg.required="Este campo es obligatorio";
        this.msg.noAuthorized="No posee permisos para esta accion";
        this.msg.object="La referencia no esta registrada";
    }
    
    abstract initPermissions();
    private _initPermissions() {
        this.permissions['list'] = this.myglobal.existsPermission(this.prefix + '_LIST');
        this.permissions['add'] = this.myglobal.existsPermission(this.prefix + '_ADD');
        this.permissions['update'] = this.myglobal.existsPermission(this.prefix + '_UPDATE');
        this.permissions['delete'] = this.myglobal.existsPermission(this.prefix + '_DELETE');
        this.permissions['filter'] = this.myglobal.existsPermission(this.prefix + '_FILTER');
        this.permissions['search'] = (this.myglobal.existsPermission(this.prefix + '_SEARCH') && this.myglobal.existsPermission(this.prefix + '_LIST'));
        this.permissions['lock'] = this.myglobal.existsPermission(this.prefix + '_LOCK');
        this.permissions['warning'] = this.myglobal.existsPermission(this.prefix + '_WARNING');
        this.permissions['visible'] = true;//this.myglobal.existsPermission(this.prefix + '_VISIBLE');
        this.permissions['audit'] = this.myglobal.existsPermission(this.prefix + '_AUDICT');
    }

    abstract initRules();
    abstract initRulesSave();
    private _initRules() {
        this.rulesDefault["detail"] = {
            "update": this.permissions.update,
            "visible": this.permissions.visible,
            "search": this.permissions.filter,
            "showbuttons": true,
            'icon': 'fa fa-list',
            "type": "textarea",
            "key": "detail",
            "title": "detalle",
            "placeholder": "ingrese el detalle",
            'msg': {}
        };
        this.rulesDefault["enabled"] = {
            "update": (this.permissions.update && this.permissions.lock),
            "visible": this.permissions.lock && this.permissions.visible,
            "search": false,
            'required': true,
            'icon': 'fa fa-list',
            "type": "boolean",
            'states': ["Habilitado", "Deshabilitado"],
            "key": "enabled",
            "title": "Habilitado",
            "placeholder": "",
            'msg': {
                'required': this.msg.required
            }
        };
    }

    abstract initParamsSearch();
    private _initParamsSearch() {
        this.paramsSearch = {
            'title': 'Title Default',
            'permission': (this.permissions.search && this.permissions.list),
            'idModal': this.prefix + '_' + this.configId + '_search',
            'endpoint': "/search" + this.endpoint,
            'placeholder': "Placeholder default",
            'label': {'title': "titulo: ", 'detail': "detalle: "},
            'msg': {
                'errors': {
                    'noAuthorized': this.msg.noAuthorized,
                },
            },
            'where': '',
            'imageGuest': '/assets/img/truck-guest.png'
        };
    }

    abstract initParamsSave();
    private _initParamsSave() {
        this.paramsSave = {
            'title': 'Title Default',
            'updateField':false,
            'permission': this.permissions.add,
            'idModal': this.prefix + '_' + this.configId + '_add',
            'endpoint': this.endpoint,
        };
    }

    abstract initRuleObject();
    private _initRuleObject() {
        this.ruleObject = {
            'icon': 'fa fa-list',
            "type": "text",
            "required":false,
            "visible":true,
            "key": "keyDefault",
            "keyDisplay": "keyDefault",
            "title": "TipoDefault",
            'object': true,
            "placeholder": "PlaceHolder default",
            'paramsSearch': this.paramsSearch,
            "permissions": this.permissions,
            'msg': {
                'error': this.msg.error,
                'object': this.msg.object,
                'required': this.msg.required
            }
        }
    }

    getRulesDefault(){
        return this.rulesDefault;
    }

}