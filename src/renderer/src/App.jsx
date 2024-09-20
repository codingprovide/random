import {
  Box,
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  DialogTitle,
  Dialog
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import InboxIcon from '@mui/icons-material/Inbox'
import DraftsIcon from '@mui/icons-material/Drafts'
import { useEffect, useState } from 'react'
import MentorRandom from './components/MentorRandom'

function App() {
  const [randomNumber, setRandomNumber] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [drawnNumbers, setDrawnNumbers] = useState([]) // Already drawn numbers
  const [open, setOpen] = useState(false)
  const [randomColor, setRandomColor] = useState('')
  const [colorCount, setColorCount] = useState({
    '#FF5733': 0, // 顏色 1
    '#33FF57': 0, // 顏色 2
    '#3357FF': 0, // 顏色 3
    '#F1C40F': 0 // 顏色 4
  })
  const [drawnColors, setDrawnColors] = useState([]) // Colors already assigned
  const [isUpperclassman, setIsUpperclassman] = useState(false) // 狀態來區分是否是 Upperclassmen

  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F']

  // 隨機選擇顏色，並確保每種顏色最多使用 4 次
  const getRandomColor = () => {
    let availableColors = colors.filter((color) => colorCount[color] < 4)
    if (availableColors.length === 0) return null
    const randomIndex = Math.floor(Math.random() * availableColors.length)
    return availableColors[randomIndex]
  }
  const getNextUniqueNumber = () => {
    let newNumber
    let attempts = 0
    do {
      newNumber = Math.floor(Math.random() * 16) + 1
      attempts++
      // 如果嘗試超過一定次數（避免無限循環），則停止
      if (attempts > 50) {
        alert('無法找到新的唯一數字')
        return null
      }
    } while (drawnNumbers.includes(newNumber)) // 確保沒有重複數字
    return newNumber
  }
  // 新增的重設函數
  const resetDraw = () => {
    setDrawnNumbers([]) // 清空已抽取的數字
    setColorCount({
      '#FF5733': 0, // 重置所有顏色的使用次數
      '#33FF57': 0,
      '#3357FF': 0,
      '#F1C40F': 0
    })
    setDrawnColors([]) // 清空已分配的顏色
    setRandomNumber(null) // 重置隨機數字
    setRandomColor('') // 重置隨機顏色
  }

  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)

  // 點擊 Upperclassmen 時隨機選擇顏色
  const handleUpperclassmanClick = () => {
    resetDraw()
    setIsUpperclassman(true) // 設定為 Upperclassman
    setOpen(false) // 關閉 Dialog
  }

  // 點擊 Freshmen 時不需要隨機顏色
  const handleFreshmanClick = () => {
    resetDraw()
    setIsUpperclassman(false) // 設定為不是 Upperclassman
    setOpen(false) // 關閉 Dialog
  }

  // 當動畫進行中，每 100 毫秒選一個新的隨機數字和對應的顏色（根據 isUpperclassman）
  useEffect(() => {
    let interval
    if (isAnimating) {
      interval = setInterval(() => {
        const newNumber = getNextUniqueNumber()

        if (newNumber !== null) {
          setRandomNumber(newNumber)

          // 如果是高年級生，隨機選擇顏色
          if (isUpperclassman) {
            const color = getRandomColor()
            if (color) {
              setRandomColor(color)
            } else {
              alert('所有顏色都已經使用完畢！')
              setIsAnimating(false)
            }
          } else {
            // 新生的情況下，不需要隨機顏色
            setRandomColor('')
          }
        } else {
          // 停止動畫，避免重複的問題
          setIsAnimating(false)
        }
      }, 100) // 每 100 毫秒更新一次數字和顏色
    }

    return () => clearInterval(interval)
  }, [isAnimating, drawnNumbers, isUpperclassman])

  useEffect(() => {
    console.log('drawnNumbers:' + drawnNumbers)
    console.log('drawnColors:' + drawnColors)
    console.log('colorCount:' + JSON.stringify(colorCount))
  }, [drawnNumbers, drawnColors, colorCount])

  const startAnimation = () => {
    if (drawnNumbers.length < 16) {
      const newNumber = getNextUniqueNumber() // 預先取得不重複的數字
      if (newNumber !== null) {
        setIsAnimating(true)
        let interval = setInterval(() => {
          setRandomNumber(Math.floor(Math.random() * 16) + 1) // 畫面上顯示跳動的數字
        }, 100) // 每 100 毫秒更新畫面上的數字

        setTimeout(() => {
          clearInterval(interval) // 停止數字跳動
          setIsAnimating(false)
          setRandomNumber(newNumber) // 最後顯示最終決定的數字
          setDrawnNumbers((prevNumbers) => [...prevNumbers, newNumber]) // 更新已抽取的數字

          // 確保顏色分配邏輯在高年級生模式下執行
          if (isUpperclassman) {
            const color = getRandomColor()
            if (color) {
              setRandomColor(color)
              setColorCount((prevCounts) => ({
                ...prevCounts,
                [color]: prevCounts[color] + 1
              }))
              setDrawnColors((prevColors) => [...prevColors, color])
            } else {
              alert('所有顏色都已經使用完畢！')
            }
          }
        }, 3000) // 動畫持續 3 秒
      }
    } else {
      alert('所有數字都已抽完！')
    }
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100vh'
        }}
      >
        <MentorRandom
          randomNumber={randomNumber}
          startAnimation={startAnimation}
          isAnimating={isAnimating}
          randomColor={randomColor}
          drawnNumbers={drawnNumbers}
          drawnColors={drawnColors}
        />
        <Box sx={{ marginTop: '20px' }}>
          {'目前已抽選顏色 : '}
          {drawnColors.map((color, index) => (
            <Box
              key={index}
              sx={{
                width: '10px',
                height: '10px',
                backgroundColor: color,
                display: 'inline-block', // Ensure the boxes are displayed inline
                margin: '2px' // Add margin between color boxes
              }}
            ></Box>
          ))}
        </Box>
        <div>{'目前已抽選數字 : ' + drawnNumbers}</div>
      </Box>

      <Fab
        sx={{ position: 'fixed', right: '150px', bottom: '100px' }}
        color="primary"
        aria-label="add"
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle sx={{ textAlign: 'center' }}>選擇抽籤模式</DialogTitle>
        <List sx={{ width: '300px' }}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleUpperclassmanClick}>
              {' '}
              {/* 點擊後會隨機選擇顏色 */}
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="數字跟顏色一起抽籤" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleFreshmanClick}>
              {' '}
              {/* 點擊後不會隨機選擇顏色 */}
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary="數字抽籤" />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    </>
  )
}

export default App
