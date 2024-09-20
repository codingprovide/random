import { Typography, Button } from '@mui/material'

export default function MentorRandom({
  randomNumber,
  startAnimation,
  isAnimating,
  randomColor,
  drawnNumbers,
  drawnColors
}) {
  return (
    <>
      <Typography
        sx={{ color: isAnimating ? randomColor : drawnColors[drawnColors.length - 1], margin: 0 }}
        variant="h1"
        fontSize={700}
        gutterBottom
      >
        {isAnimating ? randomNumber : drawnNumbers[drawnNumbers.length - 1]}
      </Typography>
      <Button
        onClick={startAnimation}
        variant="contained"
        disabled={isAnimating}
        sx={{ width: '200px', fontSize: '1.2rem' }}
      >
        {isAnimating ? '抽籤中...' : '開始抽籤'}
      </Button>
    </>
  )
}
