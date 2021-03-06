import {globalService} from "./globalService";
import {CatalogApp} from "./catalogApp";

declare var moment:any;

export abstract class ModelBase{

    public prefix = "DEFAULT";
    public endpoint = "DEFAULT_ENDPOINT";
    public completed=false;
    public permissions:any = {};
    public paramsSearch:any = {};
    public paramsSave:any = {};
    public ruleObject:any={};
    public rulesSave:any={};
    public msg:any=CatalogApp.msg;
    public rules={};

    public configId = moment().valueOf();
    private rulesDefault:any = {};

    constructor(prefix,endpoint,public myglobal:globalService){
        this.prefix = prefix;
        this.endpoint = endpoint;

        this._initModel();
    }

    private _initModel(){
        this._initPermissions();
        this._initRules();
        this._initParamsSearch();
        this._initParamsSave();
        this._initRuleObject();
    }
    public initModel(completed=true){
        this.initPermissions();
        this.modelExternal();
        this.initRules();
        this.initRulesSave();
        this.initParamsSearch();
        this.initParamsSave();
        this.initRuleObject();

        this.loadObjectRule();
        this.loadParamsSave();
        this.loadParamsSearch();

        this.completed=completed;
    }

    public mergeRules(){
        this.rules = Object.assign({},this.rules,this.getRulesDefault());
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

    abstract modelExternal();
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
            "title": "Detalle",
            "placeholder": "ingrese el detalle",
        };
        this.rulesDefault["enabled"] = {
            "update": (this.permissions.update && this.permissions.lock),
            "visible": this.permissions.lock && this.permissions.visible,
            "search": false,
            'required': true,
            'icon': 'fa fa-list',
            "type": "boolean",
            'source': [
                {'value':true,'text': 'Habilitado', 'class': 'btn btn-sm btn-green'},
                {'value':false,'text': 'Deshabilitado', 'class': 'btn btn-sm btn-red'},
            ],
            "key": "enabled",
            "title": "Habilitado",
            "placeholder": "",
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
            'imageGuest': '/assets/img/truck-guest.png',
            'field':'any'
        };
    }
    private loadParamsSearch(){
        this.paramsSearch.field = this.ruleObject.key+'.id';
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
            'readOnly':false,
            'protected':false,
            'update':false,
            'search':false,
            "type": "text",
            "required":true,
            "visible":true,
            "key": "keyDefault",
            "keyDisplay": "keyDefault",
            "title": "TipoDefault",
            'object': true,
            'code': 'default',
            'prefix':'',
            "placeholder": "PlaceHolder default",
            'paramsSearch': {},
            "permissions": {},
            "rulesSave":{},
            "paramsSave":{}
        }
    }

    getRulesDefault(){
        return this.rulesDefault;
    }
    private loadObjectRule(){
        this.ruleObject.rulesSave = this.rulesSave;
        this.ruleObject.paramsSave = this.paramsSave;
        this.ruleObject.permissions = this.permissions;
        this.ruleObject.paramsSearch = this.paramsSearch;
        this.ruleObject.prefix = this.prefix;
        this.ruleObject.search = this.permissions.search;

    }
    private loadParamsSave(){
        this.paramsSave.prefix = this.prefix+'_ADD';
    }

    public setDataField(id,key,value?,callback?,data?){
        let json = {};
        json[key] = value || null;
        let body = JSON.stringify(json);
        return (this.myglobal.httputils.onUpdate(this.endpoint + id, body,{}).then(response=>{
            if(callback)
                callback(response,data);
        }));
    }

    public extendRulesObjectInRules(rules){
        let that = this;

        Object.keys(rules).forEach(key=>{
            if(rules[key].object){
                Object.keys(rules[key].rulesSave).forEach(subKey=>{
                    rules[key+that.capitalizeFirstLetter(subKey)] = rules[key].rulesSave[subKey];
                    rules[key+that.capitalizeFirstLetter(subKey)].search=false;
                })
            }
        })
    }
    public capitalizeFirstLetter (data) {
        return data.charAt(0).toUpperCase() + data.slice(1);
    }


}