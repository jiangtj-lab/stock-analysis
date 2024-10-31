import dayjs from 'dayjs'
import fs from 'node:fs'
import path from 'node:path'

const fileContent = fs.readFileSync('list.json', 'utf-8')
const parsedData = JSON.parse(fileContent)

// 接受命令行参数 使用 dayjs 转换为时间戳
const tBegin = dayjs(process.argv[2]).unix() * 1000
const tEnd = dayjs(process.argv[3]).unix() * 1000

const filter = parsedData.filter((item) => item.t >= tBegin).filter((item) => item.t <= tEnd)

const first = filter[0]
const end = filter[filter.length - 1]
const totals = filter.map((item) => item.total)
console.log('固定金额(亏损补，收益取，保证金额一致)')
console.log('期间内最多投入资金(理想总资金)')
console.log(1 + first.total - Math.min(...totals))
console.log('期间内收益')
console.log(end.total - first.total)
console.log('期间内收益相对于理想总资金(理想收益)')
console.log((end.total - first.total) / (1 + first.total - Math.min(...totals)))
console.log('------------')
console.log('投入后躺平收益(资金保持不变，不取不补)')
console.log((end.close - first.close) / first.close)
