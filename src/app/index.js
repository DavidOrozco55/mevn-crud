import Vue from 'vue';
import App from './components/App.vue';
import ThemeToggler from './components/themeToggler.vue';


new Vue({
    render: h=> h(App),
}).$mount('#app');