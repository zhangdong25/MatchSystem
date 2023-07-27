<template>
  <div id="content">
    <div id="form">
      <h4>信息填写</h4>
      <div id="main">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" :disabled=show>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="contact">
            <el-input v-model="ruleForm.contact"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="ruleForm.idCard"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio v-model="ruleForm.gender" label="1">男</el-radio>
            <el-radio v-model="ruleForm.gender" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="所在省份" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择所在省份">
              <el-option label="上海" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
              <el-option label="辽宁" value="liaoning"></el-option>
              <el-option label="深圳" value="shenzhen"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="个人描述" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        idCard: '',
        password: '',
        gender: '1',
        desc: '',
        contact: ''
      },
      show: false,
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 3 或 4 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择所在区域', trigger: 'change' }
        ],
        idCard: [
          { required: true, message: '请输入正确的身份证号', trigger: 'change' },
          { min: 18, max: 18, message: '长度18个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 8, max: 256, message: '长度8个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写个人描述', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ]
      },
      numsRegex: /^1(3\d|4[5-9]|5[^4]|6[567]|7[^249]|8\d|9[189])\d{8}$/, // 定义正则表达式
      idRegex: /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}[Xx\d]$/,
      isNumsValid: false,
      isIdValid: false,
    };
  },
  methods: {
    success() {
      const data = this.ruleForm;
      axios.post('http://127.0.0.1/api/register', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log(response.data.done);
          this.show = true;
          this.$message({
            message: '恭喜你，成功创建，自动登录中',
            type: 'success'
          });
        })
        .catch(error => {
          console.error(error);
        });
    },
    checkNums() {
      this.isNumsValid = this.numsRegex.test(this.ruleForm.contact); // 使用正则表达式测试输入值
    },
    checkId() {
      this.isIdValid = this.idRegex.test(this.ruleForm.idCard); // 使用正则表达式测试输入值
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // 校验所有信息是否合格
        if (valid) {
          // 继续校验手机号码是否正确
          this.checkNums();
          this.checkId()
          if (this.isNumsValid && this.isIdValid) {
            this.success();
            setTimeout(function () {
              this.$router.push({ path: '/home' });
            }.bind(this), 1000);
          } else {
            console.log('error submit!!');
            return false;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
}
</script>

<style lang="less" scoped>
#content {
  width: 100vw;
  height: 100vh;
  background-color: #c3d7df;
  // background-image: url(https://s1.ax1x.com/2023/03/05/ppExLLT.jpg);
  background-size: cover;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

#form {
  width: 30%;
  height: 80%;
  background-color: #d8e3e7;
  display: flex;
  flex-direction: column;
  align-items: center;
  // box-shadow: 1px 10px 50px #c3d7df;
  border-radius: 24px;
}

#main {
  width: 100%;
  height: 85%;
}

/deep/ .el-input {
  width: 70%;
}

/deep/ .el-textarea {
  width: 70%;
}

/deep/ .el-select {
  width: 100%;
}
</style>