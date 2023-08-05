import './common/plugins';
import '../less/custom.less';
import '../less/pos_invoice.css';
import 'ant-design-vue/dist/reset.css';

import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import App from './main/views/App.vue';
import routes from './main/router'
import store from './main/store';
import { setupI18n, loadLocaleMessages } from './common/i18n';

import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
import print from 'vue3-print-nb';

import AdminPageFilter from "./common/layouts/AdminPageFilters.vue";
import AdminPageTableContent from "./common/layouts/AdminPageTableContent.vue";
import { VueRestrictedInputDirective } from 'vue-restricted-input';

async function bootstrap() {
    if (store.getters["auth/isLoggedIn"]) {
        store.dispatch("auth/updateUser");
    }

    store.dispatch("auth/updateGlobalSetting");
    store.dispatch("auth/updateApp");
    store.dispatch("auth/updateAllLangs");
    store.dispatch("auth/updateAllWarehouses");
    store.commit("auth/updateActiveModules", window.config.modules);
    store.dispatch("auth/updateVisibleSubscriptionModules");

    const app = createApp(App);

    const i18n = setupI18n({ legacy: false, globalInjection: true, locale: store.state.auth.lang, warnHtmlMessage: false });
    await loadLocaleMessages(i18n, store.state.auth.lang);

    // app.config.devtools = true;
    // app.config.debug = true;

    app.use(i18n);
    app.use(Antd);
    app.use(PerfectScrollbar)
    app.use(store);
    app.use(print);

    // Plugin Import
    const allModules = window.config.installed_modules;
    const allModulesPromise = [];
    allModules.forEach((allModule) => {
        const moduleName = allModule.verified_name;
        const pluginModule = import(`../../Modules/${moduleName}/Resources/assets/js/${moduleName}.js`);
        allModulesPromise.push(pluginModule);
    });
    Promise.all(allModulesPromise).then(
        (allModulesPromiseResponse) => {
            allModulesPromiseResponse.forEach((allModulesPromiseResponseData) => {
                app.use(allModulesPromiseResponseData.default, { routes, store });
            });

            routes.addRoute({
                path: "/:catchAll(.*)",
                redirect: '/'
            });

            // Adding routes after plugins routes
            app.use(routes);
        }
    );

    // Global Components
    app.component('admin-page-filters', AdminPageFilter);
    app.component('admin-page-table-content', AdminPageTableContent);
    app.directive('mask', VueRestrictedInputDirective);

    window.i18n = i18n;

    routes.isReady().then(() => {
        if (routes.currentRoute && routes.currentRoute.value && routes.currentRoute.value.meta && routes.currentRoute.value.meta.isFrontStore) {
            store.commit("front/updateWarehouseSlug", routes.currentRoute.value.params.warehouse);
            store.commit("front/updateWarehouseCurrency", window.config.warehouseCurrency);
            store.commit("front/updateApp", window.config.frontStoreSettings);
        }
        app.mount("#app");
    })
}

window.Emoji = function () {
    var ranges = [
        '\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]'
    ];

    function removeInvalidChars(str) {
        return str.replace(new RegExp(ranges.join('|'), 'g'), '');
    }

    document.querySelectorAll('input').forEach(function (element) {
        element.removeEventListener('blur', (e) => {
            console.log(1);
        });
        element.removeEventListener('focus', (e) => {
            console.log(1);
        });
        element.removeEventListener('input', (e) => {
            console.log(1);
        });
    });

    document.querySelectorAll('input').forEach(function (element) {
        element.addEventListener('input', (event) => {
            element.value = removeInvalidChars(event.target.value);
        });
    });
}


bootstrap();



