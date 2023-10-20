<script>
/** 
 * 登录页面
 *  */
import { defineComponent,ref,reactive, computed,onMounted,onActivated } from "vue";
import publicApi from '@/common/http/Public.js';
import userApi from '@/common/http/User.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute,useRouter } from 'vue-router';
import {throttleFn_1 as throttleFn} from '@/common/DebounceAndThrottle';
import { verifiedData } from "@/common/VerifiedTools";
import { formatWebsiteList } from "@/common/OtherTools";
import { Select,ArrowRightBold,SemiSelect } from '@element-plus/icons-vue';
import {userData} from "@/store/user";

export default defineComponent({
    name:'LoginView',
    components: {
        Select,ArrowRightBold,SemiSelect,
    },
    setup(){
        const userDataStore = userData();
        const router = useRouter();
        const route = useRoute();
        const FormElRef = ref(null);
        const dataContainer = reactive({
            form: {
                name:'',
                password:'',
                captchaText:'',
            },
            rules: {
                name: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                captchaText: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                ],
            },
            loading:false,
            captchaSvg:'',
            captchaId:'',
            loading_1:false,
        });
        /** 验证信息 */
        function validBase(data){
            const failData = verifiedData(data,{
                name:{
                    label:'账号 : 不能为空 && 长度1-150',
                    validate(value){
                        if(!value && value !== 0) return false;
                        value = String(value);
                        if(value.length < 1) return false;
                        if(value.length > 150) return false;
                        return true;
                    },
                },
                password:{
                    label:'密码 : 不能为空 && 长度1-150',
                    validate(value){
                        if(!value && value !== 0) return false;
                        value = String(value);
                        if(value.length < 1) return false;
                        if(value.length > 150) return false;
                        return true;
                    },
                },
                captchaText:{
                    label:'验证码 : 不能为空 && 长度1-7',
                    validate(value){
                        if(!value && value !== 0) return false;
                        value = String(value);
                        if(value.length < 1) return false;
                        if(value.length > 7) return false;
                        return true;
                    },
                },
            });
            return failData;
        }
        /** 获取验证码 */
        const getCaptcha = throttleFn(function (){
            if(dataContainer.loading_1) return;
            dataContainer.loading_1 = true;
            publicApi.getCaptcha().then(res=>{
                const data = res.data || {};
                dataContainer.captchaId = data.id;
                dataContainer.captchaSvg = data.svg;
                dataContainer.form.captchaText = '';
            }).catch(()=>{
                ElMessage.error('验证码获取失败');
            }).finally(()=>{
                dataContainer.loading_1 = false;
            });
        },700);
        getCaptcha();
        /** 登录操作 */
        const onLogin = throttleFn(function(otherParmas){
            if(dataContainer.loading) return;
            if (!FormElRef.value) return;
            FormElRef.value.validate((valid,e) => {
                if (!valid){
                    const message = e[Object.keys(e)[0]][0].message;
                    ElMessage.error(message);
                    return;
                };
                const verifiedData = validBase(dataContainer.form);
                if(verifiedData){
                    ElMessage.error('参数错误！'+verifiedData[0].label);
                    return;
                };
                dataContainer.loading = true;
                const params = {
                    ...dataContainer.form,
                    ...otherParmas,
                };
                params.captchaId = dataContainer.captchaId;
                userApi.login(params).then(async res=>{
                    let data = res || {};
                    dataContainer.form.password = '';
                    /** 写入全局数据 */
                    userDataStore.setUserInfo({
                        token:data.token || '',
                    });
                    ElMessage({
                        type: 'success',
                        message: '登录成功',
                    });
                    /** 
                     * 登录成功，跳转到首页
                     * 其他用户信息会在路由跳转是获取到
                     *  */
                    router.push('/');
                }).catch((res)=>{
                    ElMessage.error('登录失败：'+res.msg);
                }).finally(()=>{
                    dataContainer.loading = false;
                    getCaptcha();
                });
            });
        },700);
        /** 去除首尾空格 */
        function toTrim(data,p){
            let str = data[p];
            str = (str || "").replace(/^\s+|\s+$/g,"");
            data[p] = str;
        }
        /** 去除特殊符号 */
        function palindrome(data,p){
            let str = data[p];
            str = (str || "").replace(/[`:~!#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ~！#￥%……&*（） \+ ={}|《》？：“”【】、；‘’，。、]/g,"");
            data[p] = str;
        }
        return {
            dataContainer,
            onLogin,
            FormElRef,
            getCaptcha,
            toTrim,
            palindrome,
        };
    },
});
</script>

<template>
    <div class="login-view">
        <div class="container">
            <div class="left">
            </div>
            <div class="right">
                <div class="container">
                    <el-form
                        label-position="top"
                        label-width="100px"
                        :model="dataContainer.form"
                        :rules="dataContainer.rules"
                        class="form-container container"
                        ref="FormElRef"
                    >
                        <el-form-item label="账号" prop="name">
                            <el-input 
                                clearable
                                @input="()=>{
                                    toTrim(dataContainer.form,'name');
                                    palindrome(dataContainer.form,'name');
                                }"
                                @keyup.enter="onLogin"
                                v-model="dataContainer.form.name" />
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input 
                                type="password"
                                clearable
                                @keyup.enter="onLogin"
                                show-password
                                @input="()=>{
                                    toTrim(dataContainer.form,'password');
                                }"
                                v-model="dataContainer.form.password" />
                        </el-form-item>
                        <el-form-item label="验证码" prop="captchaText">
                            <div class="captcha-container">
                                <el-input 
                                    v-model="dataContainer.form.captchaText" 
                                    placeholder=""
                                    clearable
                                    @keyup.enter="onLogin">
                                </el-input>
                                <div 
                                    class="captcha-right"
                                    @click="getCaptcha"
                                    v-html="dataContainer.captchaSvg">
                                </div>
                            </div>
                        </el-form-item>
                        <div class="bt-list">
                            <el-button
                                v-if="!dataContainer.form.idU"
                                type="primary"
                                :loading="dataContainer.loading"
                                @click="onLogin">
                                登 录
                                <el-icon
                                    size="20px"
                                    style="margin-left: 15px;"><ArrowRightBold /></el-icon>
                            </el-button>
                        </div>
                        <div class="other">
                            登录管理网址,
                            <router-link to="/register">
                                没有账号？去注册
                            </router-link>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="bottom">
            版权所有 @www.dumogu.top
        </div>
    </div>
</template>

<style lang="scss" scoped>
.login-view{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(https://c.wallhere.com/photos/82/08/light_baby_elephant_wool_girl_socks_vintage_ties-799904.jpg!d);
    background-size: cover;
    backdrop-filter: blur(12px);
    >.container{
        display: flex;
        flex-direction: row;
        width: 900px;
        background-color: rgb(255, 255, 255);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 3px 8px 0 rgba(0, 0, 0, .408);
        >.left{
            flex: 1 1 0;
            width: 0;
            background-image: url(https://s1.ax1x.com/2023/08/21/pPG62bF.jpg);
            background-size: cover;
        }
        >.right{
            flex: 1 1 0;
            width: 0;
            >.container{
                width: 100%;
                height: 100%;
                padding: 60px 30px;
                box-sizing: border-box;
                :deep(.bt-list){
                    width: 100%;
                    >*{
                        width: 100%;
                    }
                }
                :deep(.captcha-container){
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    >*{
                        flex: 1 1 0;
                        width: 0;
                    }
                    >.captcha-right{
                        background-color: rgb(220, 220, 220);
                        height: 30px;
                        border-radius: 5px;
                        overflow: hidden;
                        margin-left: 15px;
                        cursor: pointer;
                    }
                }
                :deep(.other){
                    margin-top: 15px;
                }
            }
        }
    }
    >.bottom{
        position: fixed;
        bottom: 15px;
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
