<script setup lang="ts">
import hljs from 'highlight.js'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import java from 'highlight.js/lib/languages/java'
import { Marked } from 'marked'

import { markedHighlight } from 'marked-highlight'
import { nextTick, ref, watchEffect } from 'vue'
// 导入代码高亮主题
import 'highlight.js/styles/github-dark.css'
// 导入需要支持的语言
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

const props = defineProps<{ content: string }>()
// 注册语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('markdown', markdown)

const htmlContent = ref('')

// 配置 marked
const marked = new Marked(
  markedHighlight({
    async: false,
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
  {
    gfm: true,
    breaks: true,
  },
)

// 监视内容变化并渲染 Markdown
watchEffect(async () => {
  try {
    htmlContent.value = await marked.parse(props.content)
  }
  catch (error) {
    console.error('Markdown parsing error:', error)
    htmlContent.value = props.content
  }
})

// 代码块添加复制按钮
watchEffect(() => {
  nextTick(() => {
    const codeBlocks = document.querySelectorAll('pre code')
    codeBlocks.forEach((block) => {
      const pre = block.parentElement
      if (pre && !pre.querySelector('.copy-button')) {
        // 设置语言标识
        const lang = block.className.split(' ').find(cls => cls.startsWith('language-'))?.replace('language-', '')
        if (lang && lang !== 'plaintext') {
          const langTag = document.createElement('div')
          langTag.className = 'lang-tag'
          langTag.textContent = lang
          pre.appendChild(langTag)
        }

        // 添加复制按钮
        const button = document.createElement('button')
        button.className = 'copy-button'
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'
        button.onclick = async () => {
          try {
            await navigator.clipboard.writeText(block.textContent || '')
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>'
            setTimeout(() => {
              button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'
            }, 2000)
          }
          catch (err) {
            console.error('Failed to copy:', err)
          }
        }
        pre.appendChild(button)
      }
    })
  })
})
</script>

<template>
  <div class="markdown-body" v-html="htmlContent" />
</template>

<style>
:root {
  --markdown-font-size: 14px;
}

.markdown-body {
  color: var(--text-100);
  line-height: 1.6;
  font-size: var(--markdown-font-size);
}

.markdown-body h1 {
  font-size: calc(var(--markdown-font-size) * 1.6);
}

.markdown-body h2 {
  font-size: calc(var(--markdown-font-size) * 1.4);
}

.markdown-body h3 {
  font-size: calc(var(--markdown-font-size) * 1.2);
}

.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  font-size: var(--markdown-font-size);
}

.markdown-body p {
  margin: 0.8em 0;
  line-height: 1.7;
  font-size: var(--markdown-font-size);
}

.markdown-body code {
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
  font-size: calc(var(--markdown-font-size) * 0.9);
}

.markdown-body p code {
  font-size: calc(var(--markdown-font-size) * 0.9);
}

.markdown-body pre {
  margin: 1em 0;
  padding: 1em 1.2em;
  border-radius: 8px;
  background-color: #1e1e1e;
  overflow-x: auto;
  position: relative;
  border: 1px solid #2d2d2d;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.markdown-body li {
  margin: 0.3em 0;
}

.markdown-body blockquote {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #71c4ef;
  background-color: rgba(113, 196, 239, 0.1);
  color: #666;
  border-radius: 4px;
}

.copy-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.4rem;
  color: #abb2bf;
  background-color: #2d2d2d;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

pre:hover .copy-button {
  opacity: 1;
}

.copy-button:hover {
  background-color: #3d3d3d;
  color: #fff;
}

.copy-button svg {
  width: 16px;
  height: 16px;
}

/* 语言标签样式 */
.lang-tag {
  position: absolute;
  top: 0;
  right: 2.5rem; /* 为复制按钮留出空间 */
  padding: 0.25rem 0.5rem;
  font-size: calc(var(--markdown-font-size) * 0.75);
  color: #abb2bf;
  background-color: #2d2d2d;
  border-radius: 0 0 4px 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

pre:hover .lang-tag {
  opacity: 1;
}

.hljs {
  color: #e6e6e6;
  background: transparent;
}

/* 代码高亮样式 */
.hljs-keyword {
  color: #c678dd;
}
.hljs-function {
  color: #61afef;
}
.hljs-string {
  color: #98c379;
}
.hljs-number {
  color: #d19a66;
}
.hljs-comment {
  color: #7f848e;
  font-style: italic;
}
.hljs-title {
  color: #61afef;
}
.hljs-params {
  color: #abb2bf;
}
.hljs-built_in {
  color: #e5c07b;
}
.hljs-variable {
  color: #e06c75;
}
.hljs-operator {
  color: #56b6c2;
}
.hljs-property {
  color: #e06c75;
}
.hljs-punctuation {
  color: #abb2bf;
}

/* 滚动条样式 */
.markdown-body pre::-webkit-scrollbar {
  height: 6px;
}
.markdown-body pre::-webkit-scrollbar-thumb {
  background-color: #4b5263;
  border-radius: 3px;
}
.markdown-body pre::-webkit-scrollbar-track {
  background-color: #282c34;
}

/* 链接样式 */
.markdown-body a {
  color: #71c4ef;
  text-decoration: none;
  transition: color 0.2s ease;
}

.markdown-body a:hover {
  color: #00668c;
  text-decoration: underline;
}

/* 表格样式 */
.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid #e1e4e8;
  padding: 0.5em 1em;
}

.markdown-body th {
  background-color: #f6f8fa;
  font-weight: 600;
}

.markdown-body tr:nth-child(even) {
  background-color: #fafbfc;
}
</style>
