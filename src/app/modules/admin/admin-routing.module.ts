import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from "./admin.component";
import { CommonRoutes } from "src/global.routes";
import { ManageListComponent } from "./components/manage-list/manage-list.component";
import { ManageSessionComponent } from "./components/manage-session/manage-session.component";
import { PermissionGuard } from "src/app/core/guards/permission/permission.guard";
import { permissions , actions, manageSessionAction} from 'src/app/core/constants/permissionsConstant';
import { CreateSessionPage } from "src/app/pages/create-session/create-session.page";
import { MANAGERS_CREATE_SESSION_FORM } from "src/app/core/constants/formConstant";
import { PrivateGuard } from "src/app/core/guards/private.guard";

const routes: Routes = [
    {
        path: CommonRoutes.ADMIN_DASHBOARD,
        component: AdminComponent
    },
    {
        path: CommonRoutes.MANAGE_USER,
        component: ManageListComponent,
        canActivate: [PermissionGuard],
        data: {
            permissions: { module: permissions.MANAGE_USER, action: [actions.GET] },
          },
    },
    {
        path: CommonRoutes.MANAGE_SESSION,
        component: ManageSessionComponent,
        canActivate: [PermissionGuard],
        data: {
            permissions: { module: permissions.MANAGE_SESSION, action: manageSessionAction.MANAGE_ACTIONS },
        }
    },
    {
        path: CommonRoutes.MANAGERS_SESSION,
        loadChildren: () => import('../../pages/create-session/create-session.module').then( m => m.CreateSessionPageModule),
        canActivate: [PrivateGuard],
        data: {
          forms: { page: MANAGERS_CREATE_SESSION_FORM}
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
