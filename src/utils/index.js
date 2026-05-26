export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

export const debounce = (fn, delay) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 图片缓存
const imageCache = new Map()
const loadingPromises = new Map()

// 并发请求限制
const MAX_CONCURRENT = 4
let currentConcurrency = 0
const waitingQueue = []

// 加载单张图片
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      imageCache.set(src, img)
      resolve(img)
    }
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`))
    }
    img.src = src
  })
}

// 带并发控制的图片加载
export const loadImageWithLimit = async (src) => {
  // 如果已经缓存，直接返回
  if (imageCache.has(src)) {
    return imageCache.get(src)
  }
  
  // 如果正在加载，返回同一个Promise
  if (loadingPromises.has(src)) {
    return loadingPromises.get(src)
  }
  
  return new Promise((resolve, reject) => {
    const task = () => {
      currentConcurrency++
      const promise = loadImage(src)
      loadingPromises.set(src, promise)
      
      promise.then((img) => {
        currentConcurrency--
        loadingPromises.delete(src)
        resolve(img)
        processQueue()
      }).catch((err) => {
        currentConcurrency--
        loadingPromises.delete(src)
        reject(err)
        processQueue()
      })
    }
    
    if (currentConcurrency < MAX_CONCURRENT) {
      task()
    } else {
      waitingQueue.push(task)
    }
  })
}

// 处理等待队列
const processQueue = () => {
  while (currentConcurrency < MAX_CONCURRENT && waitingQueue.length > 0) {
    const task = waitingQueue.shift()
    task()
  }
}

// 批量加载图片
export const loadImagesBatch = async (srcs, batchSize = 4) => {
  const results = []
  for (let i = 0; i < srcs.length; i += batchSize) {
    const batch = srcs.slice(i, i + batchSize)
    const batchPromises = batch.map(src => loadImageWithLimit(src))
    const batchResults = await Promise.allSettled(batchPromises)
    results.push(...batchResults)
  }
  return results
}

// 获取图片（带缓存）
export const getImage = (src) => {
  return imageCache.get(src)
}

// 清除图片缓存
export const clearImageCache = () => {
  imageCache.clear()
}

// 懒加载指令配置
export const lazyLoadDirective = {
  mounted: (el, binding) => {
    const src = binding.value
    
    // 设置占位图
    el.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 267"%3E%3Crect fill="%23f5f5f5" width="200" height="267"/%3E%3Ctext fill="%23ccc" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E加载中...%3C/text%3E%3C/svg%3E'
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImageWithLimit(src).then((img) => {
            el.src = src
          }).catch(() => {
            el.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 267"%3E%3Crect fill="%23f5f5f5" width="200" height="267"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E图片加载失败%3C/text%3E%3C/svg%3E'
          })
          observer.disconnect()
        }
      })
    }, {
      rootMargin: '100px',
      threshold: 0.1
    })
    
    observer.observe(el)
  }
}
