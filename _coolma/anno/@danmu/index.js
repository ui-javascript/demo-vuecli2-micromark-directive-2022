import { getNextTextOrLinkNodeByLatestAncestor, getNextNodeByAncestor, renderVoidElement, getPrevTextOrLinkNodeByAncestors, getPrevTextOrLinkNodeByLatestAncestors, getNanoId } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import { customAlphabet, nanoid } from "nanoid";
import Vue from "vue";


export default {
  namespace: "danmu",

  realAnnoRequiredArgNames: ['content'], // 不需要参数
  realAnnoExtArgNames: ['type'], // 补充字段, 数组形式, 非必填
  realAnnoShortcutAttrs: null,

  // 自动转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: true, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: true, 

  beforeRender: {
  
    prevNode2Attr: (node, ancestors, realAnnoRequiredArgNames, prevNode) => {
      node.attributes[realAnnoRequiredArgNames[0]] = trim(prevNode.value)
      renderVoidElement(prevNode) // 取值结束不再需要渲染后置节点
    },
    nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
      node.attributes[realAnnoRequiredArgNames[0]] = trim(nextNode.value)
      renderVoidElement(nextNode) // 取值结束不再需要渲染后置节点
    }
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs) => {

  
    var Danmu = Vue.extend({
      template: `<vue-danmaku loop :danmus="danmus" style="height:100px; width:300px;"></vue-danmaku>`,
      data: function () {
        return {
          danmus: [node.attributes[realAnnoRequiredArgNames[0]]],
        }
      }
    })

    const danmuId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`div#${danmuId}`, { ...node.attributes })

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;
    // data.value = null

    //  div好像没有onload方法
    let retryTimes = 0 
    function renderTimer() {

      const danmu = document.getElementById(danmuId)
      if (danmu) {

        
        new Danmu().$mount(`#${danmuId}`)

      } else {
        retryTimes++
        console.log(node.name + "重试" + retryTimes + "次")
        setTimeout(() => {
           retryTimes < 3 && renderTimer()
        }, 200)
      }
    }

    renderTimer()


 

  },
};
