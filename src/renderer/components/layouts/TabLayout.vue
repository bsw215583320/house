<template>
    <div>
        <a-menu v-model="current" mode="horizontal" @click="menuClick">
            <a-menu-item key="house"> <a-icon type="home" />房源</a-menu-item>
            <a-menu-item key="customer"> <a-icon type="team" />客户</a-menu-item>
        </a-menu>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        name:"TabLayout",
        data() {
            return {
                current: ['house'],
            };
        },
        created() {
            this.current = [this.$route.name]
        },
        methods:{
            menuClick(e){
                    this.$router.push(e.key)

            }
        }
    };
</script>
