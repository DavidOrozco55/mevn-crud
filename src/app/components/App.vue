<template>
    <div class="content">
        <div class="form-container">
            <h1>Agregar tarea</h1>
            <div class="form">
                <input type="text" class="form-input" placeholder="Nombre de la actividad" v-model="newTask.name">

                <div class="timeDiv">
                    <div class="hourDiv">
                        <input min='0' max='3' type="number" class="form-input" v-model.number='newTask.hours'>
                        <p>Horas</p>
                    </div>
    
                    <div class="minuteDiv">
                        <input  min='0' max='59' type="number" class="form-input" v-model.number='newTask.minutes'>
                        <p>Minutos</p>
                    </div>
                </div>
                
                <div class="errors" v-if="errors.length != 0">
                    <p class="error" v-for='error in errors'>
                        {{error}}
                    </p>
                </div>

                <button class="form-input" @click="addTask">Guardar</button>
            </div>

        </div>

        <div class="activities">
            <h1>Lista de tareas diarias</h1>
            <div class="activity" v-for='task in tasks'>
                <p class="activity-name">{{task.name}}</p>
                <p>Duración: {{task.hours}}:{{task.minutes}}</p>
                <button class="edit" @click="editTask(task.id)">Editar</button>
                <button class="delete" @click="deleteTask(task.id)">Eliminar</button>
            </div>
            <p 
                    v-if='getTotalTime.totalHours === 0 && getTotalTime.totalMinutes === 0'
                >
                    No tienes tareas actualmente 🙁
                </p>
               <p v-else>Total de tiempo en tareas {{getTotalTime.totalHours}} horas con {{getTotalTime.totalMinutes}} minutos</p>
        </div>
        <themeToggler></themeToggler>

    </div>


</template>

<script>
    import themeToggler from './themeToggler.vue'

    class Task{
        constructor(id,name,hours,minutes){
            this.id = id;
            this.name = name;
            this.hours = hours;
            this.minutes = minutes;
        }
    }
    export default{
        components:{
            'themeToggler': themeToggler
        },
        data() {
            return {
                newTask:{
                    id: '',
                    name: '',
                    hours: '',
                    minutes: '',
                },
                tasks:[],
                ready:false,
                errors:[],
                editTaskFlag:false,
                indexOfTks2Edit: -1,
                themeClass: 'fa-sun',
            }
        },
        created() {
            this.getTasks();
        },
        methods:{
            getTasks(){
                this.tasks = [];
                fetch('/api/tasks')
                .then(res=>res.json())
                .then(data=>{
                    data.forEach(element=>{
                        const newTask = new Task(element._id,element.name,element.hours,element.minutes);
                        this.tasks.push(newTask);
                    });                    
                })
                .catch(error=>console.log('Error: ' + error));
            },
            addTask(){
                this.checkInputIsOk();
                if(this.errors.length != 0) return;
                
                this.newTask.minutes= this.newTask.minutes < 10 ? '0'+ this.newTask.minutes: ''+this.newTask.minutes;
                this.newTask.hours= this.newTask.hours < 10 ? '0'+ this.newTask.hours: ''+this.newTask.hours;

                if(this.editTaskFlag){
                    // const route = 'api/tasks/'+this.newTask.id
                    const route = `/api/tasks/${this.newTask.id}/${this.newTask.name}/${this.newTask.hours}/${this.newTask.minutes}`
                    fetch(route,{
                        method: 'PUT',
                        body: JSON.stringify(this.newTask),
                        headers:{
                            'Accept':'application/json',
                            'Content-type':'application/json'
                        }
                        
                    })
                    .then(res=>res.json())
                    .then(data=>{
                        if(data.response === 'updated')
                            this.getTasks();                 
                    })
                    .catch(error=>console.log('Error: ' + error));
                    this.indexOfTks2Edit = -1;
                    this.editTaskFlag = false;
                    let auxTasks = this.tasks;
                    this.tasks = [];
                    this.tasks = auxTasks;
                }
                else{
                    fetch('/api/tasks',{
                        method: 'POST',
                        body: JSON.stringify(this.newTask),
                        headers:{
                            'Accept':'application/json',
                            'Content-type':'application/json'
                        }
                    })
                    .then(res=>res.json())
                    .then(data=>{
                        if(data.response === 'success')
                            this.getTasks();                        
                    })
                    .catch(error=>console.log('Error: ',error));
                }

                this.newTask.name = '';
                this.newTask.hours = '';
                this.newTask.minutes = '';            
            },
            deleteTask(taskId){
                if(this.tasks === undefined || this.tasks === null || taskId === undefined) return;
                const route = '/api/tasks/'+taskId;
                fetch(route,{
                    method:'DELETE',
                    headers:{
                        'Accept':'application/json',
                        'Content-type':'application/json'
                    }
                })
                .then(response=> response.json())
                .then(data=>this.getTasks())
                .catch(er=>console.log(new Error('Error: '+ er)));
                //
            },
            editTask(taskId){
                if(this.tasks === undefined || this.tasks === null || taskId === undefined) return;
                const indx = this.tasks.findIndex(el => el.id === taskId);
                const regExp = /0(?=[0-9])/; //0 followed by any number between 0 and 9
                
                this.newTask = new Task(
                    this.tasks[indx].id,
                    this.tasks[indx].name,
                    this.tasks[indx].hours,
                    this.tasks[indx].minutes);
                console.log(this.newTask);
                this.newTask.minutes = this.newTask.minutes.replace(regExp, '');
                this.newTask.hours = this.newTask.hours.replace(regExp, '');

                this.indexOfTks2Edit = indx;
                this.editTaskFlag = true;

            },
            checkInputIsOk(){
                this.errors = [];
                if(this.newTask.minutes > 59) this.errors.push('Los minutos no deben ser mayor a 59');
                if(this.newTask.minutes < 0) this.errors.push('Los minutos no deben ser mayor a 59');
                if(this.newTask.hours > 3) this.errors.push('Las horas no deben ser mayor a 3');
                if(this.newTask.minutes < 0) this.errors.push('Los minutos no deben ser mayor a 59');
                if(this.newTask.minutes === 0 && this.newTask.hours === 0) this.errors.push('La tarea debe tener duración');

                if(this.newTask.name === '')
                    this.errors.push('Introduce un nombre para la tarea');
                if(this.newTask.hours === '')
                    this.errors.push('Introduce un número mayor a 0 y menor a 3 en las horas');  
                if(this.newTask.minutes === '')
                    this.errors.push('Introduce un número mayor a 0 y menor a 59 en los minutos');
            }
        },
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

        },
        computed: {
            getTotalTime(){
                if(this.tasks.length < 0) 
                    return{
                        totalHours: 0,
                        totalMinutes: 0,                    
                    };
                let totalHours= 0;
                let totalMinutes = 0;

                this.tasks.forEach(element => {
                    totalHours+=parseInt(element.hours);
                    totalMinutes+=parseInt(element.minutes);

                    if(totalMinutes > 59){
                        totalHours+= parseInt(totalMinutes/60);
                        totalMinutes%= 60;
                    }
                });
                
                return {
                    totalHours,
                    totalMinutes,
                };
            }
        },
    }

</script>