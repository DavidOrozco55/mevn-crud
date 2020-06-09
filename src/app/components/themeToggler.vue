<template>
    <div class="themeToggler">
        <i 
            class='fas' 
            :class="themeClass" 
            @click='toggleTheme()'
            title='Cambiar tema de colores'>
        </i>
    </div>
</template>

<script>
    const body = document.getElementsByTagName('body')[0];
    const localStorage = window.localStorage;
    export default{
        data(){
            return{
                themeClass: 'fa-sun',
            }
        },
        methods:{
            toggleTheme(){
                if(this.themeClass === 'fa-sun'){
                    body.classList.replace('light','dark');
                    this.themeClass = 'fa-moon';
                    localStorage.setItem('currentTheme','dark');
                    return;
                }
                body.classList.replace('dark','light');
                this.themeClass = 'fa-sun';
                localStorage.setItem('currentTheme','light');
            }
        },
        created(){
            const contentFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
            if(contentFromLocalStorage != null) this.tasks = contentFromLocalStorage;
            const currentTheme =(localStorage.getItem('currentTheme'));
            if(currentTheme === 'light') {
                body.classList.replace('dark','light');
                this.themeClass = 'fa-sun';
            }
            else {
                body.classList.replace('light','dark');
                this.themeClass = 'fa-moon';
            
            }
        }
    }

</script>