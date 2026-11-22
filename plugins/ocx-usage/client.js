window.__ModuleLoader__.load({
  id: '@local/ocx-usage',
  factory(require) {
    const React = require('react')
    const dictionaries = {
  "en": {
    "title": "OCX usage",
    "description": "OpenCodex token totals and account quota in the right sidebar.",
    "refresh": "Refresh",
    "loading": "Fetching OpenCodex data…",
    "failed": "Could not refresh OpenCodex data. Check that OCX is running on the Harness host, then retry.",
    "usage": "Tokens used",
    "quota": "Quota remaining",
    "today": "Today",
    "last7Days": "Last 7 days",
    "total": "Total",
    "input": "Input",
    "output": "Output",
    "cacheRead": "Cache read",
    "cacheWrite": "Cache write",
    "unavailable": "Unavailable",
    "truncated": "OCX reports incomplete history for this period.",
    "models": "By model",
    "noModels": "No model usage reported.",
    "noAccounts": "OCX returned no accounts.",
    "fetched": "Fetched",
    "observed": "Observed",
    "generated": "Reported",
    "resets": "Reset",
    "resetPassed": "Reset time passed; refresh for a new observation.",
    "showing": "Showing the first 10 models.",
    "previous": "Showing the previous snapshot.",
    "shortQuota": "5h",
    "weeklyQuota": "Weekly",
    "shortWeek": "7d",
    "shortLimit": "5-hour limit",
    "weeklyLimit": "Weekly limit",
    "usageSource": "Usage source",
    "your": "Your",
    "plan": "plan",
    "credits": "Credits",
    "manage": "Manage usage",
    "resetsAt": "Resets",
    "asOf": "as of",
    "left": "left",
    "details": "Open full usage breakdown",
    "detailsUnavailable": "Open a conversation to see the full breakdown."

  },
  "zh": {
    "title": "OCX 用量",
    "description": "在右侧栏查看 OpenCodex 的令牌用量和账户额度。",
    "refresh": "刷新",
    "loading": "正在获取 OpenCodex 数据…",
    "failed": "无法刷新 OpenCodex 数据。请确认 OCX 在 Harness 主机上运行后重试。",
    "usage": "已用令牌",
    "quota": "剩余额度",
    "today": "今天",
    "last7Days": "过去 7 天",
    "total": "合计",
    "input": "输入",
    "output": "输出",
    "cacheRead": "缓存读取",
    "cacheWrite": "缓存写入",
    "unavailable": "不可用",
    "truncated": "OCX 报告此时段的历史记录不完整。",
    "models": "按模型",
    "noModels": "没有模型用量记录。",
    "noAccounts": "OCX 未返回任何账户。",
    "fetched": "获取时间",
    "observed": "观测时间",
    "generated": "报告时间",
    "resets": "重置时间",
    "resetPassed": "重置时间已过；请刷新以获取新数据。",
    "showing": "仅显示前 10 个模型。",
    "previous": "正在显示上一次的快照。",
    "shortQuota": "5 小时",
    "weeklyQuota": "每周",
    "shortWeek": "7天",
    "shortLimit": "5 小时限额",
    "weeklyLimit": "每周限额",
    "usageSource": "用量来源",
    "your": "您的",
    "plan": "套餐",
    "credits": "额度",
    "manage": "管理用量",
    "resetsAt": "重置",
    "asOf": "截至",
    "left": "可用",
    "details": "打开完整用量明细",
    "detailsUnavailable": "请打开对话以查看完整明细。"
  }
}
    const h = React.createElement
    const ID = '@local/ocx-usage'
    const NS = 'ocxUsage'
    const seat = 'sidebar.right.pane.tab'
    const metricKeys = [['total','totalTokens'], ['input','inputTokens'], ['output','outputTokens'], ['cacheRead','cacheReadInputTokens'], ['cacheWrite','cacheCreationInputTokens']]
    const token = name => `var(--dsw-alias-${name})`
    const border = `1px solid ${token('border-l1')}`
    const card = { border, borderRadius: 10, background: token('bg-layer-1'), padding: 12, minWidth: 0 }
    const line = { display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8, flexWrap:'wrap' }
    const muted = { color:token('label-secondary'), fontSize:'0.88em' }
    const count = (value, missing) => Number.isFinite(value) ? new Intl.NumberFormat().format(value) : missing
    function date(value) {
      const parsed = value instanceof Date ? value.getTime() : typeof value === 'number' ? value : typeof value === 'string' ? Date.parse(value) : NaN
      return Number.isFinite(parsed) && Number.isFinite(new Date(parsed).getTime()) ? new Date(parsed) : null
    }
    function time(value) {
      const d = date(value)
      return d ? new Intl.DateTimeFormat(undefined, { dateStyle:'medium', timeStyle:'short' }).format(d) : null
    }
    function stamp(t, key, value) {
      const label = time(value)
      return label ? h('div',{style:muted},`${t(key)}: ${label}`) : null
    }
    function usage(t, heading, data, failed) {
      const models = Array.isArray(data?.models) ? data.models : []
      const no = t('unavailable')
      return h('section',{style:card},h('h3',{style:{margin:'0 0 8px'}},t(heading)),
        failed || !data?.summary ? h('p',{style:muted},no) : h(React.Fragment,null,
          h('dl',{style:{margin:'0 0 8px'}},metricKeys.map(([label, key]) => h('div',{key,style:line},h('dt',null,t(label)),h('dd',{style:{margin:0,fontVariantNumeric:'tabular-nums'}},count(data.summary[key],no))))),
          data.historyTruncated ? h('p',{style:muted},t('truncated')) : null,
          stamp(t,'generated',data.generatedAt),
          h('details',{style:{marginTop:10}},h('summary',null,t('models')),
            models.length ? h('ul',{style:{paddingInlineStart:16}},models.slice(0,10).map((model,i) => h('li',{key:i,style:{overflowWrap:'anywhere'}},`${[model.provider,model.model].filter(Boolean).join(' / ') || no}: ${count(model.totalTokens,no)}`))) : h('p',{style:muted},t('noModels')),
            models.length > 10 ? h('p',{style:muted},t('showing')) : null)))
    }
    function countdown(reset, now) {
      const ms = reset.getTime() - now
      const [unit, scale] = ms >= 86_400_000 ? ['day', 86_400_000] : ms >= 3_600_000 ? ['hour', 3_600_000] : ['minute', 60_000]
      return new Intl.RelativeTimeFormat(undefined, { numeric:'always' }).format(Math.ceil(ms / scale), unit)
    }
    function quota(t, data, failed, now) {
      const no = t('unavailable')
      const accounts = Array.isArray(data?.accounts) ? data.accounts : []
      return h('section',{style:{display:'grid',gap:8}},h('h2',{style:{margin:0,fontSize:'1.1em'}},t('quota')),
        failed || !data ? h('p',{style:muted},no) : h(React.Fragment,null,stamp(t,'fetched',data.fetchedAt),
          accounts.length ? accounts.map((account,i) => h('section',{key:i,style:card},
            h('h3',{style:{margin:'0 0 6px',overflowWrap:'anywhere'}},[account.provider,account.label].filter(Boolean).join(' · ') || no),
            stamp(t,'observed',account.observedAt),
            account.windows?.length ? h('ul',{style:{listStyle:'none',padding:0,margin:'8px 0 0',display:'grid',gap:10}},account.windows.map((w,j) => {
              const reset = date(w.resetAt)
              const expired = reset && reset.getTime() <= now
              const resetLabel = reset ? `${time(w.resetAt)} (${countdown(reset, now)})` : no
              const remaining = !expired && Number.isFinite(w.percentUsed) && w.percentUsed >= 0 && w.percentUsed <= 100 ? 100 - w.percentUsed : null
              return h('li',{key:j},
                h('div',{style:line},h('span',null,w.label || no), h('strong',null,remaining === null ? no : new Intl.NumberFormat(undefined,{style:'percent',maximumFractionDigits:1}).format(remaining / 100))),
                remaining === null ? null : h('meter',{min:0,max:100,value:remaining,'aria-label':`${w.label || ''} ${t('quota')}`,style:{width:'100%'}}),
                expired ? h('div',{style:muted},t('resetPassed')) : h('div',{style:muted},`${t('resets')}: ${resetLabel}`))
            })) : h('p',{style:muted},no))) : h('p',{style:muted},t('noAccounts'))))
    }
    return {
      inject:['slots','locale','sidebarRightTabs','sidebarRight'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS,dictionaries),'ocx usage: locale')
        const t = ctx.locale.bind(NS)
        ctx.effect(() => ctx.sidebarRightTabs.register({
          id:ID,kind:'ocx-usage', title:() => t('title'),
          guide:[{id:'usage',order:70,title:() => t('title'),description:() => t('description')}],
        }),'ocx usage: sidebar type')
        function useSnapshot() {
          const [data,setData] = React.useState(null)
          const [now,setNow] = React.useState(Date.now)
          React.useEffect(() => {
            const timer = setInterval(() => setNow(Date.now()), 15_000)
            return () => clearInterval(timer)
          },[])
          const [state,setState] = React.useState('loading')
          const [generation,requestRefresh] = React.useReducer(n => n + 1,0)
          const forceNext = React.useRef(false)
          React.useEffect(() => {
            const controller = new AbortController()
            let active = true
            setState('loading')
            const timer = setTimeout(() => { controller.abort(); if (active) setState('failed') },25_000)
            void (async () => {
              try {
                const suffix = forceNext.current ? '?refresh=1' : ''
                forceNext.current = false
                const response = await fetch(`api/ocx-usage/snapshot${suffix}`,{signal:controller.signal,cache:'no-store',credentials:'same-origin',headers:{accept:'application/json'}})
                if (!response.ok) throw new Error('snapshot request failed')
                const next = await response.json()
                if (!next || typeof next !== 'object' || (!next.usage && !next.quota && !next.errors)) throw new Error('invalid snapshot')
                if (active && !controller.signal.aborted) { setData(next); setState('ready') }
              } catch {
                if (active) setState('failed')
              } finally { clearTimeout(timer) }
            })()
            return () => { active = false; clearTimeout(timer); controller.abort() }
          },[generation])
          return { data, now, state, refresh: () => { forceNext.current = true; setState('loading'); requestRefresh() } }
        }
        function Glance({ wide }) {
          const { data, now, state, refresh } = useSnapshot()
          const [openError,setOpenError] = React.useState(false)
          const [hover,setHover] = React.useState(false)
          const popover = React.useRef(null)
          React.useEffect(() => {
            const el = popover.current
            if (!el) return
            const sync = () => document.querySelector('[aria-controls="ocx-quota-glance"]')?.setAttribute('aria-expanded', String(el.matches(':popover-open')))
            el.addEventListener('toggle', sync)
            return () => el.removeEventListener('toggle', sync)
          },[])
          const accounts = (data?.quota?.accounts ?? []).filter(account => account.windows?.length)
          const openai = accounts.filter(account => account.provider === 'openai')
          const primary = openai.find(account => account.active === true) ?? openai[0]
          const others = accounts.filter(account => account !== primary)
          const remainOf = w => {
            const reset = date(w?.resetAt)
            if (!Number.isFinite(w?.percentUsed) || w.percentUsed < 0 || w.percentUsed > 100) return null
            if (reset && reset.getTime() <= now) return null
            return 100 - w.percentUsed
          }
          const pct = w => {
            const remain = remainOf(w)
            return remain === null ? null : new Intl.NumberFormat(undefined,{style:'percent',maximumFractionDigits:0}).format(remain / 100)
          }
          const at = (account, name) => account?.windows?.find(w => w.label === name)
          const limitName = label => label === '5h' ? t('shortLimit') : label === 'Weekly' ? t('weeklyLimit') : String(label).split('(')[0].trim()
          if (!primary) return null
          const title = value => { const s = typeof value === 'string' ? value.trim() : ''; return s ? s[0].toUpperCase() + s.slice(1) : '' }
          const brand = { openai: 'OpenAI', openrouter: 'OpenRouter', anthropic: 'Anthropic' }
          const planName = primary.plan ? `${t('your')} ${title(primary.plan)} ${t('plan')}` : brand[primary.provider] ?? title(primary.provider)
          const amount = label => { const m = /\((.+?)\s+remaining\)/i.exec(String(label)); return m ? m[1].trim() : null }
          const rowsOf = account => account.windows.map(w => {
            const reset = date(w.resetAt)
            const upcoming = reset && reset.getTime() > now ? reset : null
            const credits = amount(w.label)
            if (credits !== null) return { label: t('credits'), value: credits, reset: upcoming }
            const value = pct(w)
            return { label: limitName(w.label), value: value === null ? t('unavailable') : `${value} ${t('left')}`, reset: upcoming }
          })
          const lines = (rows, prefix) => rows.map((r,i) => h('div',{key:`${prefix}${i}`},
            h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:18,paddingTop:8,paddingBottom:r.reset ? 2 : 8}},
              h('span',null,r.label),
              h('span',{style:{fontVariantNumeric:'tabular-nums',whiteSpace:'nowrap'}},r.value)),
            r.reset ? h('div',{style:{color:token('label-secondary'),fontSize:'0.78em',paddingBottom:6,fontVariantNumeric:'tabular-nums'}},
              `${t('resetsAt')} ${time(r.reset)} (${countdown(r.reset, now)})`) : null))
          const rule = key => h('div',{key,style:{borderTop:border}})
          const status = state === 'loading' ? t('loading') : state === 'failed' ? `${t('failed')}${data ? ` ${t('previous')}` : ''}` : ''
          const short = at(primary,'5h'), week = at(primary,'Weekly')
          const remain = remainOf(short)
          const tone = remain === null ? token('label-secondary')
            : remain >= 50 ? token('state-success-primary')
            : remain >= 20 ? token('state-warn-primary')
            : token('state-error-primary')
          const summary = `${t('title')}: ${t('shortLimit')} ${pct(short) ?? '\u2014'}, ${t('weeklyLimit')} ${pct(week) ?? '\u2014'}`
          const ring = 2 * Math.PI * 13
          const openAt = event => {
            const el = popover.current
            const trigger = event.currentTarget
            if (!el) return
            const r = trigger.getBoundingClientRect()
            el.style.top = 'auto'
            el.style.right = 'auto'
            el.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - 276))}px`
            el.style.bottom = `${Math.max(8, window.innerHeight - r.top + 8)}px`
            setOpenError(false)
            if (el.matches(':popover-open')) el.hidePopover()
            else el.showPopover()
          }
          const gauge = h('svg',{width:31,height:31,viewBox:'0 0 32 32','aria-hidden':'true',style:{display:'block'}},
            h('circle',{cx:16,cy:16,r:13,fill:'none',stroke:token('border-l3'),strokeWidth:1.6}),
            remain === null || remain <= 0 ? null : h('circle',{cx:16,cy:16,r:13,fill:'none',stroke:tone,strokeWidth:2.6,strokeLinecap:'round',
              strokeDasharray:ring,strokeDashoffset:ring * (1 - remain / 100),transform:'rotate(-90 16 16)',style:{transition:'stroke-dashoffset 320ms ease'}}),
            h('rect',{x:13,y:13,width:6,height:6,rx:1.1,transform:'rotate(45 16 16)',fill:token('label-secondary'),fillOpacity:0.45}))
          const gaugeButton = h('button',{type:'button','aria-haspopup':'dialog','aria-expanded':'false','aria-controls':'ocx-quota-glance','aria-label':summary,title:summary,
            style:{display:'flex',alignItems:'center',justifyContent:'center',width:44,height:44,border:0,borderRadius:11,
              background:hover ? token('interactive-bg-hover') : 'transparent',color:token('label-secondary'),cursor:'pointer',padding:0},
            onPointerEnter:() => setHover(true),onPointerLeave:() => setHover(false),
            onFocus:() => setHover(true),onBlur:() => setHover(false),onClick:openAt}, gauge)
          return h(React.Fragment,null,
            h('div',{style:{display:'flex',justifyContent:'flex-start',width:'100%',padding:'3px 0 3px 8px'}}, gaugeButton),
            h('div',{id:'ocx-quota-glance',popover:'auto',ref:popover,role:'dialog','aria-labelledby':'ocx-quota-heading',
              style:{position:'fixed',top:'auto',right:'auto',margin:0,width:268,maxWidth:'calc(100vw - 24px)',maxHeight:'min(520px, calc(100dvh - 24px))',overflow:'auto',boxSizing:'border-box',
                padding:'13px 18px 8px',borderRadius:14,border:`0.5px solid ${token('border-l1')}`,background:token('bg-layer-1'),
                color:token('label-primary'),fontSize:'0.93em',lineHeight:1.4,boxShadow:'var(--dsw-shadow-lv3)'}},
              h('div',{id:'ocx-quota-heading',style:{color:token('label-secondary'),paddingBottom:11}},
                `${t('usageSource')}: ${planName}`,
                data?.quota?.fetchedAt ? h('span',null,` \u00b7 ${t('asOf')} ${time(data.quota.fetchedAt)}`) : null),
              rule('top'),
              lines(rowsOf(primary),'p'),
              others.length ? h(React.Fragment,null,
                rule('mid'),
                others.map((account,j) => h(React.Fragment,{key:`o${j}`},
                  h('div',{style:{color:token('label-secondary'),fontSize:'0.86em',paddingTop:9}},`${brand[account.provider] ?? title(account.provider)} \u00b7 ${account.label}`),
                  lines(rowsOf(account), `o${j}-`)))) : null,
              status ? h('div',{role:'status',style:{color:token('label-secondary'),fontSize:'0.82em',paddingTop:8}},status) : null,
              rule('bottom'),
              h('button',{type:'button',style:{display:'block',width:'100%',textAlign:'left',border:0,background:'transparent',color:'inherit',font:'inherit',padding:'12px 0 8px',cursor:'pointer'},onClick:async () => {
                try {
                  await ctx.sidebarRight.openTab('ocx-usage')
                  popover.current?.hidePopover()
                } catch { setOpenError(true) }
              }},t('manage')),
              openError ? h('div',{role:'status',style:{color:token('label-secondary'),fontSize:'0.82em',paddingBottom:6}},t('detailsUnavailable')) : null))
        }
        function Panel() {
          const { data, now, state, refresh } = useSnapshot()
          const busy = state === 'loading'
          const errors = data?.errors
          return h('div',{style:{height:'100%',overflow:'auto',boxSizing:'border-box',padding:14,display:'flex',flexDirection:'column',gap:14,color:token('label-primary')}},
            h('header',{style:line},h('h1',{style:{margin:0,fontSize:'1.25em'}},t('title')),
              h('button',{type:'button',disabled:busy,onClick:refresh,style:{border,borderRadius:7,background:token('bg-layer-1'),color:'inherit',font:'inherit',padding:'5px 10px'}},t('refresh'))),
            h('div',{role:'status',style:muted},busy ? t('loading') : state === 'failed' ? `${t('failed')}${data ? ` ${t('previous')}` : ''}` : ''),
            data ? h(React.Fragment,null,
              h('section',{style:{display:'grid',gap:8}},h('h2',{style:{margin:0,fontSize:'1.1em'}},t('usage')),
                usage(t,'today',data.usage?.today,errors?.today),usage(t,'last7Days',data.usage?.last7Days,errors?.last7Days)),
              quota(t,data.quota,errors?.quota,now)) : null)
        }
        ctx.effect(() => ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({name:'sidebar.footer.action',id:'ocx-quota',order:-10,label:() => t('title'),locale:NS},Glance)), 'ocx usage: quota icon')
        ctx.effect(() => ctx.slots.inject(seat, () => ctx.slots.register({name:seat,key:ID,locale:NS},Panel)), 'ocx usage: sidebar body')
      },
    }
  },
})
