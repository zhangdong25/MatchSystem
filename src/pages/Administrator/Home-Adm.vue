<template>
  <div id="app">
    <el-container>
      <el-aside>
        <sider></sider>
      </el-aside>
      <el-container>
        <el-header>
          <Head></Head>
        </el-header>
        <el-main>
          <Content></Content>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import sider from "../../components/Administrator/Silder"
import Head from "../../components/Administrator//Headertop"
import Content from "../../components/Administrator/Content"
export default {
  name: 'Home',
  components: { sider, Head, Content }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  user-select: none;
}

#app {
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
}
</style>