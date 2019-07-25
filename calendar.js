// components/calendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    open: {
      type: Boolean,
      value: false,
      observer: function(newVal) {
        this.setData({
          isOpen: newVal
        })
      }
    },
    weather: {
      type: String,
      value: '晴天'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    today: [],
    isOpen: false,
    swiperIndex: 1
  },

  attached: function() {
    const { open } = this.properties

    this.todayHandle(open)

    this.setData({
      isOpen: open
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectDate: function({ currentTarget: { dataset } }) {
      const { selected } = dataset
      if (!selected) return

      let { today, swiperIndex, isOpen } = this.data

      const newDate = new Date(today[swiperIndex])
      let now = new Date(`${newDate.getFullYear()}/${newDate.getMonth() + 1}/${selected}`).getTime()

      console.log(new Date(`${newDate.getFullYear()}/${newDate.getMonth() + 1}/${selected}`))

      this.todayHandle(isOpen, now)
    },

    openBtn: function() {

      this.setData({
        isOpen: !this.data.isOpen
      })

      const { isOpen, today, swiperIndex } = this.data

      this.todayHandle(isOpen, today[swiperIndex])

      this.triggerEvent('open', { isOpen })

    },

    todayHandle: function(isOpen, date) {

      let now = date ? new Date(date) : new Date()
      console.log(now)
      const { swiperIndex } = this.data
      let { today } = this.data

      let pre, next
      const nowYear = now.getFullYear()
      const nowMonth = now.getMonth()
      const nowDate = now.getDate()

      const preDays = this.getDaysOfMonth(nowYear, nowMonth - 1)
      const nowDays = this.getDaysOfMonth(nowYear, nowMonth)
      const nextDays = this.getDaysOfMonth(nowYear, nowMonth + 1)

      if (isOpen) {
        pre = new Date(nowYear, nowMonth - 1, nowDate === nowDays ? preDays : nowDate).getTime()
        next = new Date(nowYear, nowMonth + 1, nowDate === nowDays ? nextDays : nowDate).getTime()
      } else {
        const beginDay = new Date(nowYear, nowMonth, 1).getDay()
        const endDay = new Date(nowYear, nowMonth, nowDays).getDay()

        console.log(endDay, now.getDay())

        if (nowDate - 1 <= now.getDay() - beginDay) {
          pre = new Date(nowYear, nowMonth - 1, preDays).getTime()
        } else if (nowDate - 1 <= 7) {
          pre = new Date(nowYear, nowMonth, 1).getTime()
        } else {
          pre = new Date(nowYear, nowMonth, nowDate - 7).getTime()
        }

        if (nowDays - nowDate <= endDay - now.getDay()) {
          next = new Date(nowYear, nowMonth + 1, 1).getTime()
        } else if (nowDays - nowDate <= 7) {
          next = new Date(nowYear, nowMonth, nowDays)
        } else {
          next = new Date(nowYear, nowMonth, nowDate + 7).getTime()
        }
      }

      now = now.getTime()

      switch(swiperIndex) {
        case 0:
          today = [now, next, pre]
          break
        case 1:
          today = [pre, now, next]
          break
        case 2:
          today = [next, pre, now]
          break
      }

      console.log(today)

      this.setData({
        today
      })
    },

    getDaysOfMonth(year, month) {

      let isLeapYear = false
      if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        isLeapYear = true
      }

      return [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
    },

    swiperChange: function({ detail }) {
      
      const swiperIndex = detail.current

      this.setData({
        swiperIndex
      })

      const { isOpen } = this.data
      let { today } = this.data

      this.todayHandle(isOpen, today[swiperIndex])
    }
  }
})
