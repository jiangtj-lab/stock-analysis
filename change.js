import fs from 'node:fs'
import path from 'node:path'

function readJsonFiles(directory) {
  const files = fs.readdirSync(directory)
  const jsonData = []

  files.forEach((file) => {
    if (path.extname(file) === '.json') {
      const filePath = path.join(directory, file)

      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const parsedData = JSON.parse(fileContent)
        jsonData.push(parsedData)
      } catch (error) {
        console.error(`Error reading or parsing ${filePath}:`, error)
      }
    }
  })

  return jsonData
}

// 指定文件夹路径
const directoryPath = 'SH000001'

// 读取 JSON 文件
const jsonFilesData = readJsonFiles(directoryPath)

// 输出读取的内容
const data = new Map()
jsonFilesData.forEach((f) => {
  f.data.item.forEach((i) => {
    data.set(i[0], i[5])
  })
})

const list = Array.from(data.entries())
  .map(([t, close]) => {
    return {
      t,
      close
    }
  })
  .sort((a, b) => a.t - b.t)

list.forEach((d, index) => {
  if (index === 0) {
    d.change = 0
    d.total = 0
    return
  }
  const pre = list[index - 1]
  d.change = (d.close - pre.close) / pre.close
  d.total = pre.total + d.change
})

// 将list写入文件
fs.writeFileSync('list.json', JSON.stringify(list))
