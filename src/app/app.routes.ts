import { Routes } from "@angular/router";
import { Login } from "./features/auth/pages/login/login";
import { Registrar } from "./features/auth/pages/registrar/registrar";
import { Home } from "./features/dashboard/pages/home/home";
import { DashboardLayout } from "./layouts/dashboard-layout/dashboard-layout";
import { authGuard } from "./core/guards/auth-guard";
import { List } from "./features/empleados/pages/list/list";
import { List as ListCargos } from "./features/cargos/pages/list/list";
import { List as ListDescuentos } from "./features/descuentos/pages/list/list";
import { List as ListTurnos } from "./features/turnos/pages/list/list";
import { List as ListSemanas } from "./features/semanas/pages/list/list";
import { List as ListPagos } from "./features/pagos/pages/list/list";
import { List as ListPlanillas } from "./features/planillas/pages/list/list";
import { Detail as DetailPlanilla } from "./features/planillas/pages/detail/detail";
import { Create } from "./features/empleados/pages/create/create";
import { Edit } from "./features/empleados/pages/edit/edit";
import { Detail } from "./features/empleados/pages/detail/detail";
import { List as ListAsistencias } from "./features/asistencias/pages/list/list";
import { Create as CreateAsistencia } from "./features/asistencias/pages/create/create";
import { Edit as EditAsistencia } from "./features/asistencias/pages/edit/edit";
import { List as ListDocumentos } from "./features/documentos/pages/list/list";
import { Create as CreateDocumento } from "./features/documentos/pages/create/create";
import { Edit as EditDocumento } from "./features/documentos/pages/edit/edit";

export const routes: Routes = [
  { path: "auth/login", component: Login },
  { path: "auth/registrar", component: Registrar },
  {
    path: "",
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: "dashboard", component: Home },
      { path: "empleados", component: List },
      { path: "empleados/crear", component: Create },
      { path: "empleados/:id", component: Detail },
      { path: "empleados/:id/editar", component: Edit },
      { path: "cargos", component: ListCargos },
      { path: "turnos", component: ListTurnos },
      { path: "semanas", component: ListSemanas },
      { path: "asistencias", component: ListAsistencias },
      { path: "asistencias/crear", component: CreateAsistencia },
      { path: "asistencias/:id/editar", component: EditAsistencia },
      { path: "documentos", component: ListDocumentos },
      { path: "documentos/crear", component: CreateDocumento },
      { path: "documentos/:id/editar", component: EditDocumento },
      { path: "pagos", component: ListPagos },
      { path: "planillas", component: ListPlanillas },
      { path: "planillas/:id", component: DetailPlanilla },
      { path: "descuentos", component: ListDescuentos },
      { path: "", redirectTo: "/dashboard", pathMatch: "full" },
    ],
  },
];
