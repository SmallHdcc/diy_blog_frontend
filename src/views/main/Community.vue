<script setup>
import { ref, onMounted, provide, watch } from 'vue'
import { getPublicBlogDetail, getHeatList } from '@/api/blog.js'
import { getDevLog } from '@/api/index.js'
import { useArticleStore } from '@/stores/article.js'
import showArticle from '@/components/article/articles.vue';
import showDetail from '@/components/article/showArticleDetail.vue'
import router from '../../router';
import navigation from '../../components/navigation/navigation simple.vue';
const userId = 0
provide('userId', userId)

const blogStore = useArticleStore()
watch(() => blogStore.blogArray, () => {
    community_content.value = blogStore.blogArray
})

const heat_list = ref([])

const fetchHeatList = async () => {
    const result = await getHeatList()
    if (result.data.code === 1) {
        //获取前10个
        heat_list.value = result.data.data.slice(0, 10)
    }
    heat_list.value.forEach(item => {
        item.articleTitle = item.articleTitle === null ? '虚位以待' : item.articleTitle
    });
}

function getColor(index) {
    const rank = index + 1
    if (rank === 1) {
        return 'gold-color'
    } else if (rank === 2) {
        return 'silver-color'
    } else if (rank === 3) {
        return 'copper-color'
    } else {
        return ''
    }
}


/*---控制详情页与主页---*/
const showDetailVisible = ref(false) // Flag to control visibility
provide('showDetailVisible', showDetailVisible) // Provide the flag to all children components
const handleArticleShow = ref(false)
provide('handleArticleShow', handleArticleShow)
//服务于热门列表的点击事件
const fetchArticleDetail = async (id) => {
    const result = await getPublicBlogDetail(id)
    if (result.data.code === 1) {
        localStorage.setItem("article", JSON.stringify(result.data.data))
        // router.push("/detail")
        showDetailVisible.value = true
        handleArticleShow.value = !handleArticleShow.value
    }
}

/* 控制最上方元素切换 */
const currentHoverIndex = ref(0)
const lastHoverIndex = ref(null)

const handleMouseOver = (index) => {
    currentHoverIndex.value = index
    lastHoverIndex.value = index
}
/* 控制动态输入框输入元素 */
const text = ref(null)
const textarea = ref(null)

/* 日期相关*/
//获得当前月份
const month = new Date().getMonth() + 1
//获得当前日期
const day = new Date().getDate()

/* 检查登录状态 */
const checkIsLogin = () => {

    const isLogin = JSON.parse(localStorage.getItem("baseInfo")) === null ? false : true
    if (!isLogin) {
        ElMessage.warning("请先登录")
        router.push("/login")
    }
}
const devLog = ref({
    content: "",
    createTime: ""
})
/*--- 获取开发日志 ---*/
const fetchDevLog = async () => {
    const result = await getDevLog()
    if (result.data.code === 1) {
        devLog.value = result.data.data
    }
}

/* 文章排序方式控制变量 */
const sortType = ref(0)
provide('sortType', sortType)


onMounted(() => {
    fetchHeatList()
    fetchDevLog()
})


</script>

<template>
    <div id="Community">
        <div style="width: 100%;height: 100%;">
            <el-scrollbar>
                <div class="container">
                    <div class="middle">
                        <div id="container-top">
                            <div id="container-top-left">
                                <ul class="top-left-list">
                                    <li @mouseover="handleMouseOver(index)"
                                        v-for="(item, index) in ['更新公告', '关于作者', '关于网站']" :key="index"
                                        :class="{ 'hovered': currentHoverIndex === index || lastHoverIndex === index }">
                                        {{ item }}
                                    </li>
                                </ul>
                                <div class="left-content">
                                    <template v-if="currentHoverIndex === 0">
                                        <p style="text-indent: 2em;">
                                            {{ devLog.content }}
                                        </p>
                                        <br />
                                        <p style="text-indent: 2em;">
                                            新UI持续更新中......
                                        </p>
                                        <p style="text-align: right;">于 {{ devLog.createTime }} 更新</p>
                                    </template>
                                    <template v-else-if="currentHoverIndex === 1">
                                        <div class="left-content_author">
                                            <ul class="author-info-detail">
                                                <li>昵称:smallhdcc</li>
                                                <li>院校:武汉工程大学</li>
                                                <li>专业:数据科学与大数据技术</li>
                                            </ul>
                                            <ul class="author-info-detail">
                                                <li>籍贯:河南新乡人</li>
                                                <li>学院:光能数理学院</li>
                                                <li>QQ:804678776</li>
                                            </ul>
                                        </div>
                                    </template>
                                    <template v-else-if="currentHoverIndex === 2">
                                        <p style="text-indent: 2em;">一个简单的论坛项目,因为作者实在是不懂UI设计,所以只能阉割一些内容,受制于作者的水平,
                                            网站存在的BUG还希望大家能见谅,作者会尽快修复,希望大家能够喜欢这个项目,如果有什么问题,可以联系作者.
                                        </p>
                                    </template>
                                </div>
                            </div>
                            <div id="container-top-right">
                                <div style="width: 100%;
                            height: 50px;
                            font-size: 30px; 
                            line-height: 50px;
                            border-radius:10px 10px 0 0;
                            background-color: rgb(0, 161, 214);
                            text-align: center;">
                                    {{ month }}月
                                </div>
                                <div style="width: 100%;
                                height: 200px;
                                font-size: 60px;
                                line-height: 200px;
                                text-align: center;
                                border-radius:0 0 10px 10px;">
                                    {{ day }}
                                </div>
                            </div>
                        </div>
                        <div id="container-bottom">
                            <div id="left-wrapper">
                                <div id="left-top-wrapper">
                                    <div class="top-wrapper-header">
                                        <div class="top-wrapper-header-element">发动态</div>
                                        <router-link @click="checkIsLogin()" to="/writeArticle"
                                            class="top-wrapper-header-element">写文章</router-link>
                                    </div>
                                    <div class="top-wrapper-input">
                                        <el-input v-model="text" style="width: 100%; border: none;" maxlength="10"
                                            placeholder="标题,最多10个字" show-word-limit type="text" />
                                        <div style="margin: 20px 0" />
                                        <el-input v-model="textarea" maxlength="100" resize="none" rows="6"
                                            style="width: 100%; height:80%; background-color: rgb(248, 248, 248);"
                                            placeholder="分享一下你的想法吧" show-word-limit type="textarea" />
                                    </div>
                                    <div class="more-element">
                                        <el-button type="primary" color="rgb(0, 161, 214)">发布</el-button>
                                    </div>
                                </div>
                                <div id="left-bottom-wrapper">
                                    <ul class="bottom-wrapper-header">
                                        <li v-for="(item, index) in ['关注', '推荐', '最新']" :key="index"
                                            class="bottom-wrapper-header-element">
                                            {{ item }}
                                        </li>
                                    </ul>
                                    <showArticle></showArticle>
                                </div>
                                <el-dialog v-model="showDetailVisible" width="900px" top="0vh"
                                    style="display: flex;flex-direction: column;height:700px;">
                                    <showDetail v-if="showDetailVisible"></showDetail>
                                </el-dialog>
                            </div>
                            <div id="right-wrapper">
                                <div class="side-list side-common">
                                    <h2>热门帖🔥</h2>
                                    <div v-for="(item, index) in heat_list" @click="fetchArticleDetail(item.articleId)">
                                        <div class="side-list-element" :class="getColor(index)">
                                            <span style="font-weight: 700;" :class="getColor(index)"> {{ index + 1
                                                }}.</span>
                                            {{ item.articleTitle }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <el-backtop :right="100" :bottom="100" />
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<style lang="less" scoped>
#Community {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;

    .container {
        position: relative;
        width: 100%;

        .middle {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 1200px;
            margin: 65px auto;

            #container-top {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height: 300px;
                border-radius: 10px;

                #container-top-left {
                    display: flex;
                    width: 69%;
                    height: 100%;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    background-color: white;

                    .top-left-list {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        width: 20%;
                        height: 100%;
                        padding: 0;
                        margin: 0;

                        li {
                            display: flex;
                            align-items: center; //让文字垂直居中
                            justify-content: center; //让文字水平居中
                            flex: 1; //是让子元素均分高度
                            text-align: center;
                            font-size: 24px;
                            color: #8c8b8a;
                            border-radius: 5px 0 0 5px;
                            background-color: white;
                            cursor: pointer;
                        }

                        .hovered {
                            background: linear-gradient(to right, rgba(0, 161, 214, 0.1), #ffffff);
                            color: rgb(0, 161, 214);
                        }
                    }

                    .left-content {
                        display: flex;
                        flex-direction: column;
                        width: 80%;
                        height: 100%;
                        /* 添加内边距 */
                        padding: 20px;
                        /* 添加圆角 */
                        border-radius: 0 5px 5px 0;

                        .left-content_author {
                            display: flex;
                            justify-content: space-around;
                            align-items: center;
                            width: 100%;
                            height: 100%;

                            .author-info-detail {
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;

                                li {
                                    margin: 10px 0;
                                }
                            }
                        }
                    }
                }

                #container-top-right {
                    width: 30%;
                    height: 100%;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    background-color: white;

                }
            }

            #container-bottom {
                display: flex;
                justify-content: space-between;
                width: 100%;
                border-radius: 10px;
                margin: 20px 0;

                #left-wrapper {
                    width: 69%;

                    #left-top-wrapper {
                        width: 100%;
                        height: 300px;
                        background-color: white;
                        border-radius: 10px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

                        padding: 20px;


                        .top-wrapper-header {
                            display: flex;
                            width: 100%;

                            .top-wrapper-header-element {
                                width: 70px;
                                height: 30px;
                                margin: 0 10px 10px 0;
                                color: white;
                                line-height: 30px;
                                text-align: center;
                                border-radius: 5px;
                                background-color: rgb(0, 161, 214);
                                cursor: pointer;

                            }
                        }

                        .more-element {
                            display: flex;
                            justify-content: flex-end;
                            margin: 10px 0;
                        }
                    }

                    #left-bottom-wrapper {
                        display: flex;
                        flex-direction: column;
                        flex-grow: 1;
                        width: 100%;
                        margin: 20px 0;
                        border-radius: 10px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

                        .bottom-wrapper-header {
                            display: flex;
                            justify-content: center;
                            width: 100%;
                            height: 50px;
                            border-radius: 10px 10px 0 0;
                            padding: 0;
                            border-bottom: 1px solid rgba(146, 139, 139, 0.1);
                            background-color: white;
                            overflow: hidden;

                            .bottom-wrapper-header-element {
                                flex: 1;
                                font-size: 20px;
                                line-height: 50px;
                                text-align: center;
                                cursor: pointer;
                            }

                            .bottom-wrapper-header-element:hover {
                                color: rgb(0, 161, 214);
                            }

                        }
                    }
                }

                #right-wrapper {
                    position: sticky;
                    width: 30%;
                    height: 300px;
                    top: 65px;
                    z-index: 0;

                    .side-common {
                        border-radius: 5px;
                        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
                    }

                    .side-list {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        height: 100%;
                        background-color: white;
                        overflow-y: hidden;
                        padding-left: 20px;

                        .side-list-element {
                            flex-grow: 1;
                            flex-basis: auto;
                            width: 100%;
                            cursor: pointer;
                            border-radius: 5px;
                            transition: all 0.5s;
                        }

                        .side-list-element:hover {
                            background-color: rgb(228, 233, 239);
                        }
                    }
                }
            }
        }

        .container-side-list {
            position: static;
            top: 0;
            width: 25%;
            margin: 10px 30px 0px 20px;

            .side-common {
                border-radius: 5px;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
            }

            .side-bar {
                width: 100%;
                height: 20vh;
                background-color: white;
                margin-bottom: 40px;
                text-align: center;
                line-height: 20vh;
            }

            .side-list {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 40vh;
                background-color: white;
                overflow-y: hidden;
                padding-left: 20px;

                .side-list-element {
                    flex-grow: 1;
                    flex-basis: auto;
                    width: 100%;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.5s;
                }

                .side-list-element:hover {
                    background-color: rgb(228, 233, 239);
                }
            }
        }

        .container-center-content {
            width: 75%;
            height: 100%;
        }
    }

}

.gold-color {
    color: gold;
}

.sliver-color {
    color: rgb(71, 69, 69);
}

.copper-color {
    color: #cd7f32;
}
</style>
