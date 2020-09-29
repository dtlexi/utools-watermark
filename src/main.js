// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'view-design/dist/styles/iview.css';

Vue.config.productionTip = false

import {
    Button,
    Tabs,
    TabPane,
    Upload,
    Icon,
    Dropdown,
    DropdownMenu,
    Spin,
    Slider,
    ColorPicker,
    RadioGroup,
    Radio,
    Row,
    Col,
    Form,
    FormItem,
    Input,
    Select,
    Option,
    Notice
} from 'iview';
Vue.component('Button', Button);
Vue.component('Tabs', Tabs);
Vue.component('TabPane', TabPane);
Vue.component('Upload', Upload);
Vue.component('Icon', Icon);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('Spin', Spin);
Vue.component('Slider', Slider);
Vue.component('ColorPicker', ColorPicker);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Radio', Radio);
Vue.component('Row', Row);
Vue.component('Col', Col);
Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Input', Input);
Vue.component('Select', Select);
Vue.component('Option', Option);

Vue.prototype.$notice = Notice;
Vue.prototype.$spin = Spin;

import { Sketch } from 'vue-color'
Vue.component('Sketch', Sketch);

try {
    utools.onPluginReady(() => {
        new Vue({
            el: '#app',
            router,
            components: { App },
            template: '<App/>'
        })

    });
} catch (error) {
    new Vue({
        el: '#app',
        router,
        components: { App },
        template: '<App/>'
    })
}