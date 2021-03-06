import {Component, provide, ViewChild, OnInit, HostListener} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {contentHeaders} from './common/headers';
import {AccountLogin}         from './account/account';
import {AccountRecover}         from './account/account';
import {AccountActivate}         from './account/account';
import {AccountRecoverPassword}         from './account/account';

import {Empresa}         from './empresa/empresa';
import {EmpresaTimeLine}         from './empresa/empresa';
import {TipoEmpresa}         from './tipoEmpresa/tipoEmpresa';
import {TipoVehiculo}         from './tipoVehiculo/tipoVehiculo';
import {Dashboard}         from './dashboard/dashboard';
import {User}         from './user/user';
import {Taquilla}         from './taquilla/taquilla';
import {Operacion, OperacionMonitor}         from './operacion/operacion';
import {Profile}         from './profile/profile';
import {Rol}         from './rol/rol';
import {Parametro}         from './parametro/parametro';
import {Regla}         from './regla/regla';
import {TipoRecarga}         from './tipoRecarga/tipoRecarga';
import {Recarga, RecargaLibro}         from './recarga/recarga';
import {RecargaIngresos}         from './recarga/recarga';
import {TagRfid}         from './tagRfid/tagRfid';
import {Vehiculo}         from './vehiculo/vehiculo';
import {Permiso}         from './permiso/permiso';
import {PermisosRol}         from './permiso/permisos-rol/permisosRol';
import {globalService} from "./common/globalService";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {TipoBasura} from "./tipoBasura/tipoBasura";
import {Antenna} from "./antenna/antenna";
import {Ruta} from "./ruta/ruta";
import {RestController} from "./common/restController";
import {Http} from "@angular/http";
import {ReporteGrupos} from "./reportes/reportes";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {OperacionSave} from "./operacion/methods";
import {ReporteDescargasGrupos} from "./reportes/reporteDG";
import moment from "moment/moment";
import {ReporteGruposVehiculos} from "./reportes/reporteGV";
import {ReporteDescargasRutas} from "./reportes/reporteDR";
import {ReporteDescargasBasura} from "./reportes/reporteDB";
import {GruposRutas} from "./reportes/gruposRutas";
import {EmpresaMorosos} from "./empresa/companyMorosos";
import {Caja} from "./recarga/caja";
import {TipoServicio} from "./tipoServicio/tipoServicio";
import {Servicio} from "./servicio/servicio";
import {OperacionPendiente} from "./operacion/pendiente/pendiente";
import {CustomRouterOutlet} from "./common/CustomRouterOutlet";
import {Help} from "./help/help";
import {Events} from "./event/event";
import {MHelp} from "./help/MHelp";
import {Save} from "./utils/save/save";
import {Drivers} from "./drivers/drivers";
import {OperationsAudit} from "./reportes/operationsAudit";
import {MOperacion} from "./operacion/MOperacion";
import {Register} from "./register/register";
import {ReporteClienteMensual} from "./reportes/mensualCliente/mensualCliente.component";
import {Place} from "./place/place";
import { ReportsComponents} from "./reportes/reports/reports.components";
import {ChangeComponents} from "./change/change";
import {MapaComponents} from "./mapa/mapa";
import {Zone} from "./zone/zone";
import {ContainerComponent} from "./com.zippyttech.vertedero/catalog/container/container.component";
import {PlanningComponent} from "./com.zippyttech.vertedero/catalog/planning/planning.component";
import {ScheduleComponent} from "./com.zippyttech.vertedero/catalog/schedule/schedule.component";

declare var SockJS:any;
declare var Stomp:any;
declare var SystemJS:any;
declare var jQuery:any;

@Component({
    selector: 'my-app',
    templateUrl: SystemJS.map.app + '/app.html',
    styleUrls: [SystemJS.map.app + '/app.css'],
    directives: [ROUTER_DIRECTIVES, OperacionSave, CustomRouterOutlet, Save],
    providers: [
        ROUTER_PROVIDERS, Operacion,
        provide(LocationStrategy, {useClass: HashLocationStrategy})
    ]
})
@RouteConfig([
    {path: '/account/login', name: 'AccountLogin', component: AccountLogin, useAsDefault: true},
    {path: '/account/active/:id/:token', name: 'AccountActivate', component: AccountActivate},
    {path: '/account/recover', name: 'AccountRecover', component: AccountRecover},
    {path: '/account/recoverPassword/:id/:token', name: 'AccountRecoverPassword', component: AccountRecoverPassword},

    {path: '/users', name: 'User', component: User},
    {path: '/dashboard', name: 'Dashboard', component: Dashboard},
    {path: '/taquilla', name: 'Taquilla', component: Taquilla},
    {path: '/vehiculos', name: 'Vehiculo', component: Vehiculo},
    {path: '/vehiculos/:companyId', name: 'VehiculoCompany', component: Vehiculo},
    {path: '/taquilla/:search', name: 'TaquillaSearh', component: Taquilla},

    {path: '/cliente', name: 'Empresa', component: Empresa},
    {path: '/registro', name: 'Register', component: Register},
    {path: '/cliente/morosos', name: 'EmpresaMorosos', component: EmpresaMorosos},
    {path: '/perfil', name: 'Profile', component: Profile},
    {path: '/cliente/:ruc', name: 'EmpresaTimeLine', component: EmpresaTimeLine},

    {path: '/operacion', name: 'Operacion', component: Operacion},
    {path: '/operacion/pendiente', name: 'OperacionPendiente', component: OperacionPendiente},
    {path: '/operacion/monitor', name: 'OperacionMonitor', component: OperacionMonitor},
    {path: '/roles', name: 'Rol', component: Rol},
    {path: '/factura', name: 'RecargaIngresos', component: RecargaIngresos},
    {path: '/caja', name: 'Caja', component: Caja},
    {path: '/lugar', name: 'Place', component: Place},

    {path: '/reporte/grupos', name: 'ReporteGrupos', component: ReporteGrupos},
    {path: '/reporte/grupos/rutas', name: 'GruposRutas', component: GruposRutas},
    {path: '/reporte/toneladas', name: 'ReporteDescargasGrupos', component: ReporteDescargasGrupos},
    {path: '/reporte/vehiculos', name: 'ReporteGruposVehiculos', component: ReporteGruposVehiculos},
    {path: '/reporte/rutas', name: 'ReporteDescargasRutas', component: ReporteDescargasRutas},
    {path: '/reporte/basura', name: 'ReporteDescargasBasura', component: ReporteDescargasBasura},
    {path: '/reporte/operacion/auditoria', name: 'OperationAudit', component: OperationsAudit},
    {path: '/reporte/cliente/mensual', name: 'ReporteClienteMensual', component: ReporteClienteMensual},
    {path: '/reporte/reports/Globales', name: 'ReportsComponents', component: ReportsComponents},
    {path: '/movimientos', name: 'ChangeComponents', component: ChangeComponents},
    {path: '/mapa', name: 'MapaComponents', component: MapaComponents},




    {path: '/permisos', name: 'Permiso', component: Permiso},
    {path: '/permisos/rol', name: 'PermisoRol', component: PermisosRol},
    {path: '/parametro', name: 'Parametro', component: Parametro},
    {path: '/regla', name: 'Regla', component: Regla},
    {path: '/recargas', name: 'Recarga', component: Recarga},
    {path: '/libro', name: 'RecargaLibro', component: RecargaLibro},
    {path: '/tipoRecarga', name: 'TipoRecarga', component: TipoRecarga},
    {path: '/tipoBasura', name: 'TipoBasura', component: TipoBasura},
    {path: '/tipo/servicio', name: 'TipoServicio', component: TipoServicio},
    {path: '/servicio', name: 'Servicio', component: Servicio},
    {path: '/grupo', name: 'TipoEmpresa', component: TipoEmpresa},
    {path: '/tipoVehiculo', name: 'TipoVehiculo', component: TipoVehiculo},
    {path: '/tagRfid', name: 'TagRfid', component: TagRfid},
    {path: '/antenas', name: 'Antenna', component: Antenna},
    {path: '/rutas', name: 'Ruta', component: Ruta},
    {path: '/ayuda', name: 'Help', component: Help},
    {path: '/eventos', name: 'Event', component: Events},
    {path: '/chofer', name: 'Drivers', component: Drivers},
    {path: '/container', name: 'ContainerComponent', component: ContainerComponent},
    {path: '/zone', name: 'Zone', component: Zone},
    {path: '/planning', name: 'PlanningComponent', component: PlanningComponent},
    {path: '/schedule', name: 'ScheduleComponent', component: ScheduleComponent},
    {path: '/**', redirectTo: ['Dashboard']}

])
export class AppComponent extends RestController implements OnInit {
    public saveUrl:string;
    public rulesOperacion = {};
    public menu_modal:string = "";
    public menu_list:string = "";

    public help:MHelp;
    public operation:MHelp;


    constructor(public router:Router, http:Http, public myglobal:globalService, public toastr:ToastsManager) {
        super(http);
        let url="https://dev.aguaseo.com:8080";
        localStorage.setItem('urlAPI', url + '/api');
        localStorage.setItem('url', url);
        let that = this;
        router.subscribe(
            function (data) {
                if (that.isPublic() && !localStorage.getItem('bearer')) {
                    that.myglobal.init = true;
                }
                else if (that.isPublic() && localStorage.getItem('bearer')) {
                    let link = ['Dashboard', {}];
                    that.router.navigate(link);
                }
                else if (!that.isPublic() && !localStorage.getItem('bearer')) {
                    that.saveUrl = that.router.currentInstruction.component.routeName;
                    let link = ['AccountLogin', {}];
                    that.router.navigate(link);
                }
                else if (that.saveUrl) {
                    let link = [that.saveUrl, {}];
                    that.saveUrl = null;
                    that.router.navigate(link);

                }

                if (that.myglobal.getParams('VERSION_CACHE') != localStorage.getItem('VERSION_CACHE') && (that.myglobal.init && localStorage.getItem('bearer'))) {
                    localStorage.setItem('VERSION_CACHE', that.myglobal.getParams('VERSION_CACHE'))
                    location.reload(true);
                }

            }, function (error) {
                console.log("entro2");
            }
        );//this.onSocket();
    }

    ngOnInit() {
        
    }
    addOperationGlobal(data){
        this.myglobal.dataOperation.updateValue(data);
    }
    ngAfterViewInit() {

    }

    setInstance(instance, prefix) {
        if (!this.myglobal.objectInstance[prefix])
            this.myglobal.objectInstance[prefix] = {};
        this.myglobal.objectInstance[prefix] = instance;
    }

    public urlPublic = ['AccountLogin', 'AccountActivate', 'AccountRecover', 'AccountRecoverPassword'];

    public isPublic() {
        let data = this.router.currentInstruction.component.routeName;
        let index = this.urlPublic.findIndex(obj=>obj == data);
        if (index > -1)
            return true;
        return false;
    }

    logout(event) {
        event.preventDefault();
        let that = this;
        let successCallback = response => {
            this.myglobal.init = false;
            localStorage.removeItem('bearer');
            contentHeaders.delete('Authorization');
            this.menuItems = [];
            this.activeMenuId = "";

            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
        this.httputils.doPost('/logout', null, successCallback, this.error);

    }

    profile(event) {
        event.preventDefault();
        let link = ['Profile', {}];
        this.router.navigate(link);

    }

    validToken() {
        if (localStorage.getItem('bearer'))
            return true;
        return false;
    }

    loadPermisos(event) {
        event.preventDefault();
        this.myglobal.loadMyPermissions();
    }

    activeMenuId:string;

    activeMenu(event, id) {
        if(event)
            event.preventDefault();
        if (this.activeMenuId == id)
            this.activeMenuId = "";
        else
            this.activeMenuId = id;

    }

    onSocket() {
        let ws = new SockJS(localStorage.getItem("url") + "/stomp");
        let client = Stomp.over(ws);
        let that = this;

        client.connect({}, function () {
            client.subscribe("/topic/read", function (message) {
                let str = JSON.parse(message.body);
                if (str['entrada']) {
                    that.toastr.success('Placa: ' + str['entrada'].vehiclePlate, 'Vehículo Entrando');
                }
            });
        });


    }

    outAnt(event, myglobal, data?) {
        if(this.activeMenu)
            this.activeMenu(null,null);
        event.preventDefault();
        if (myglobal.objectInstance['OP']) {
            if(data)
                myglobal.objectInstance['OP'].loadOperationOut(data);
            else
                myglobal.objectInstance['OP'].loadReadOperations();
        }
    }

    public monitor:any = {};
    public monitorInterval:any;
    public enableMonitor:boolean = false;

    loadMonitor() {
        let that = this;
        if (!that.enableMonitor && localStorage.getItem('bearer')) {
            that.where = "&where=" + encodeURI("[['op':'isNull','field':'weightOut']]");
            that.max = 10;
            that.monitorInterval = setInterval(()=> {
                if (localStorage.getItem('bearer')) {
                    that.onloadData('/operations/', that.monitor)
                }
                else {
                    clearInterval(that.monitorInterval);
                }
            }, 10000)
        }
        that.enableMonitor = true;
    }

    formatDate(date, format) {
        if (date)
            return moment(date).format(format);
        return "";
    }

    loadPage() {
        this.menu_modal = this.myglobal.getParams('MENU_MODAL');
        this.menu_list = this.myglobal.getParams('MENU_LIST');
        this.loadMenu();
        this.initModels();

        if (this.menu_list != '' && this.menu_list != '1') {
            jQuery('body').addClass('no-menu');
        }
    }
    initModels(){
        this.help = new MHelp(this.myglobal);
        this.help.paramsSave.updateField=true;
        this.operation = new MOperacion(this.myglobal);
    }

    public menuItems = [];

    loadMenu() {
        if (this.menuItems.length == 0) {
            this.menuItems.push({
                'visible': this.myglobal.existsPermission("MEN_DASHBOARD"),
                'icon': 'fa fa-home',
                'title': 'Dashboard',
                'routerLink': 'Dashboard'
            });
            this.menuItems.push({
                'visible': this.myglobal.existsPermission("MEN_TAQ"),
                'icon': 'fa fa-dollar',
                'title': 'Taquilla',
                'routerLink': 'Taquilla'
            });
            this.menuItems.push({
                'visible': this.myglobal.existsPermission("MEN_OP") || this.myglobal.existsPermission("MEN_OP_PEN") || this.myglobal.existsPermission("MEN_SERV")
                || this.myglobal.existsPermission("MEN_RECARGAS") || this.myglobal.existsPermission("MEN_INGRESOS") || this.myglobal.existsPermission("MEN_LIBRO")
                || this.myglobal.existsPermission("MEN_SEMI_ES") || this.myglobal.existsPermission("MEN_SEMI_SA")
                || this.myglobal.existsPermission("MEN_PLANNING"),
                'icon': 'fa fa-gears',
                'title': 'Transacciones',
                'key': 'Transacciones',
                'treeview': [
                    {
                        'visible': this.myglobal.existsPermission("MEN_OP"),
                        'icon': 'fa fa-user',
                        'title': 'Operación',
                        'routerLink': 'Operacion'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_OP_PEN"),
                        'icon': 'fa fa-user',
                        'title': 'Operación Pendiente',
                        'routerLink': 'OperacionPendiente'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_PLANNING"),
                        'icon': 'fa fa-list',
                        'title': 'Planificación',
                        'routerLink': 'PlanningComponent'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_SERV"),
                        'icon': 'fa fa-list',
                        'title': 'Servicios',
                        'routerLink': 'Servicio'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_SEMI"),
                        'icon': 'fa fa-sign-out',
                        'title': 'OP. Semiauto',
                        'modal': true,
                        'modalId': '#operacionManual',
                        'function': this.outAnt
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_RECARGAS"),
                        'icon': 'fa fa-money',
                        'title': 'Recarga',
                        'routerLink': 'Recarga'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_INGRESOS"),
                        'icon': 'fa fa-money',
                        'title': 'Ingresos',
                        'routerLink': 'RecargaIngresos'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_LIBRO"),
                        'icon': 'fa fa-book',
                        'title': 'Libro',
                        'routerLink': 'RecargaLibro'
                    },

                ]

            });
            this.menuItems.push({
                'visible': this.myglobal.existsPermission("MEN_USERS") || this.myglobal.existsPermission("MEN_CLIENTES")
                || this.myglobal.existsPermission("MEN_VEH") || this.myglobal.existsPermission("MEN_TAG")
                || this.myglobal.existsPermission("MEN_CHOFER") || this.myglobal.existsPermission("MEN_CONTAINER")
                || this.myglobal.existsPermission("MEN_RUTAS") || this.myglobal.existsPermission("MEN_TIP_VEH")
                || this.myglobal.existsPermission("MEN_PLACE")|| this.myglobal.existsPermission("MEN_CHANGE")
                || this.myglobal.existsPermission("MEN_ZONE") || this.myglobal.existsPermission("MEN_SCHEDULE")
                || this.myglobal.existsPermission("MEN_GROUPS") || this.myglobal.existsPermission("MEN_TIP_RECARGA")
                || this.myglobal.existsPermission("MEN_TIP_BAS") || this.myglobal.existsPermission("MEN_TIP_SERV"),
                'icon': 'fa fa-gears',
                'title': 'Administración',
                'key': 'Administración',
                'treeview': [
                    {
                        'visible': this.myglobal.existsPermission("MEN_USERS"),
                        'icon': 'fa fa-user',
                        'title': 'Usuarios',
                        'routerLink': 'User'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_CLIENTES"),
                        'icon': 'fa fa-building-o',
                        'title': 'Clientes',
                        'routerLink': 'Empresa'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_VEH"),
                        'icon': 'fa fa-truck',
                        'title': 'Vehículos',
                        'routerLink': 'Vehiculo'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_TAG"),
                        'icon': 'fa fa-user',
                        'title': 'Tag RFID',
                        'routerLink': 'TagRfid'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_CHOFER"),
                        'icon': 'fa fa-group',
                        'title': 'Tripulación',
                        'routerLink': 'Drivers'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_CONTAINER"),
                        'icon': 'glyphicon glyphicon-inbox',
                        'title': 'Container',
                        'routerLink': 'ContainerComponent'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_RUTAS"),
                        'icon': 'fa fa-crosshairs',
                        'title': 'Rutas',
                        'routerLink': 'Ruta'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_TIP_VEH"),
                        'icon': 'fa fa-user',
                        'title': 'Tipo de vehículo',
                        'routerLink': 'TipoVehiculo'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_PLACE"),
                        'icon': 'fa fa-user',
                        'title': 'Lugares',
                        'routerLink': 'Place'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_CHANGE"),
                        'icon': 'fa fa-user',
                        'title': 'Movimientos',
                        'routerLink': 'ChangeComponents'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_ZONE"),
                        'icon': 'fa fa-list',
                        'title': 'Zonas',
                        'routerLink': 'Zone'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_SCHEDULE"),
                        'icon': 'fa fa-calendar',
                        'title': 'Horarios',
                        'routerLink': 'ScheduleComponent'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_GROUPS"),
                        'icon': 'fa fa-users',
                        'title': 'Grupo de clientes',
                        'routerLink': 'TipoEmpresa'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_TIP_RECARGA"),
                        'icon': 'fa fa-user',
                        'title': 'Tipo de recarga',
                        'routerLink': 'TipoRecarga'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_TIP_BAS"),
                        'icon': 'fa fa-trash',
                        'title': 'Tipo de basura',
                        'routerLink': 'TipoBasura'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_TIP_SERV"),
                        'icon': 'fa fa-archive',
                        'title': 'Tipo de servicio',
                        'routerLink': 'TipoServicio'
                    },
                ]

            });
            this.menuItems.push({
                'visible': this.myglobal.existsPermission("MEN_CAJA") || this.myglobal.existsPermission("MEN_REP_RU") || this.myglobal.existsPermission("MEN_REP_GROUPS")
                || this.myglobal.existsPermission("MEN_DESC_GROUPS") || this.myglobal.existsPermission("MEN_VEH") || this.myglobal.existsPermission("MEN_REP_CONSU_RUT")
                || this.myglobal.existsPermission("MEN_REP_CONSU_BAS") || this.myglobal.existsPermission("MEN_ACCESS_CLIENT")
                || this.myglobal.existsPermission("MEN_MONTH_CLIENT") || this.myglobal.existsPermission("MEN_REPORTS_CLIENT"),
                'icon': 'fa fa-list',
                'title': 'Reportes',
                'key': 'Reportes',
                'treeview': [
                    {
                        'visible': this.myglobal.existsPermission("MEN_MONTH_CLIENT"),
                        'icon': 'fa fa-list',
                        'title': 'Registro por clientes',
                        'routerLink': 'ReporteClienteMensual'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_REPORTS_CLIENT"),
                        'icon': 'fa fa-list',
                        'title': 'Informes',
                        'routerLink': 'ReportsComponents'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_ACCESS_CLIENT"),
                        'icon': 'fa fa-list',
                        'title': 'Registro de acceso',
                        'routerLink': 'Register'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_OP_AUD"),
                        'icon': 'fa fa-list',
                        'title': 'Operacion auditoria',
                        'routerLink': 'OperationAudit'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_CAJA"),
                        'icon': 'fa fa-list',
                        'title': 'Caja',
                        'routerLink': 'Caja'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_REP_RU"),
                        'icon': 'fa fa-list',
                        'title': 'Rutas',
                        'routerLink': 'GruposRutas'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_REP_GROUPS"),
                        'icon': 'fa fa-truck',
                        'title': 'Descarga por grupos',
                        'routerLink': 'ReporteGrupos'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_DESC_GROUPS"),
                        'icon': 'fa fa-user',
                        'title': 'Grupos por peso',
                        'routerLink': 'ReporteDescargasGrupos'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_REP_VEH"),
                        'icon': 'fa fa-truck',
                        'title': 'Descarga por vehículos',
                        'routerLink': 'ReporteGruposVehiculos'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_REP_CONSU_RUT"),
                        'icon': 'fa fa-truck',
                        'title': 'Descarga por rutas',
                        'routerLink': 'ReporteDescargasRutas'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_REP_CONSU_BAS"),
                        'icon': 'fa fa-trash',
                        'title': 'Descarga por tipo basura',
                        'routerLink': 'ReporteDescargasBasura'
                    },
                ]

            });
            this.menuItems.push({
                'visible': this.myglobal.existsPermission("MEN_ROLES") || this.myglobal.existsPermission("MEN_PERMISOS") || this.myglobal.existsPermission("MEN_ACL"),
                'icon': 'fa fa-gears',
                'title': 'Acceso',
                'key': 'Acceso',
                'treeview': [
                    {
                        'visible': this.myglobal.existsPermission("MEN_ROLES"),
                        'icon': 'fa fa-key',
                        'title': 'Roles',
                        'routerLink': 'Rol'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_PERMISOS"),
                        'icon': 'fa fa-key',
                        'title': 'Permisos',
                        'routerLink': 'Permiso'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_ACL"),
                        'icon': 'fa fa-key',
                        'title': 'ACL',
                        'routerLink': 'PermisoRol'
                    },
                ]

            });
            this.menuItems.push({
                'visible': this.myglobal.existsPermission("MEN_ANTENAS") || this.myglobal.existsPermission("MEN_PARAM")
                || this.myglobal.existsPermission("MEN_RULE") || this.myglobal.existsPermission("MEN_INFO") || this.myglobal.existsPermission("MEN_EVENT"),
                'icon': 'fa fa-gears',
                'title': 'Configuración',
                'key': 'Configuración',
                'treeview': [
                    {
                        'visible': this.myglobal.existsPermission("MEN_ANTENAS"),
                        'icon': 'fa fa-crosshairs',
                        'title': 'Antenas',
                        'routerLink': 'Antenna'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_PARAM"),
                        'icon': 'fa fa-user',
                        'title': 'Parámetro',
                        'routerLink': 'Parametro'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_RULE"),
                        'icon': 'fa fa-user',
                        'title': 'Regla',
                        'routerLink': 'Regla'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_INFO"),
                        'icon': 'fa fa-archive',
                        'title': 'Informacion',
                        'routerLink': 'Help'
                    },
                    {
                        'visible': this.myglobal.existsPermission("MEN_EVENT"),
                        'icon': 'fa fa-archive',
                        'title': 'Eventos',
                        'routerLink': 'Event'
                    },
                ]

            });
        }
    }

    menuItemsVisible(menu) {
        let data = [];
        menu.forEach(obj=> {
            if (obj.visible)
                data.push(obj)
        })
        return data;
    }

    menuItemsTreeview(menu) {
        let data = [];
        let datatemp = [];
        menu.forEach(obj=> {
            if (obj.treeview)
                data.push(obj)
            else
                datatemp.push(obj)
        })
        data.unshift({'icon': 'fa fa-gears', 'title': 'General', 'key': 'General', 'treeview': datatemp})
        return data;
    }

    replace(data:string) {
        return data.replace(/;/g, ' ');
    }
    @HostListener('window:offline') offline() {
        this.toastr.error('Se a detectado un problema con el internet, Por favor conectarse a la red');
    }
}
