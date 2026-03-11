// 이미지를 Canvas에 로드
function loadImageToCanvas(imageFile) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // 비교를 위해 동일한 크기로 리사이즈 (300x300)
      const size = 300;
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, 0, 0, size, size);
      const imageData = ctx.getImageData(0, 0, size, size);

      resolve({
        canvas,
        ctx,
        imageData,
        width: size,
        height: size,
        originalWidth: img.width,
        originalHeight: img.height,
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(imageFile);
  });
}

// 픽셀 단위 색상 유사도 (MSE 기반)
function calculatePixelSimilarity(data1, data2) {
  let totalDiff = 0;
  const pixelCount = data1.length / 4;

  for (let i = 0; i < data1.length; i += 4) {
    const rDiff = data1[i] - data2[i];
    const gDiff = data1[i + 1] - data2[i + 1];
    const bDiff = data1[i + 2] - data2[i + 2];

    totalDiff += (rDiff * rDiff + gDiff * gDiff + bDiff * bDiff) / 3;
  }

  const mse = totalDiff / pixelCount;
  // MSE를 0-100 점수로 변환 (MSE가 낮을수록 유사도 높음)
  const similarity = Math.max(0, 100 - (mse / 255) * 100);
  return similarity;
}

// 색상 히스토그램 생성
function createColorHistogram(data) {
  const histogram = {
    r: new Array(256).fill(0),
    g: new Array(256).fill(0),
    b: new Array(256).fill(0),
  };

  for (let i = 0; i < data.length; i += 4) {
    histogram.r[data[i]]++;
    histogram.g[data[i + 1]]++;
    histogram.b[data[i + 2]]++;
  }

  return histogram;
}

// 히스토그램 유사도 (상관계수)
function calculateHistogramSimilarity(hist1, hist2) {
  const channels = ['r', 'g', 'b'];
  let totalSimilarity = 0;

  for (const channel of channels) {
    const h1 = hist1[channel];
    const h2 = hist2[channel];

    // 평균 계산
    const mean1 = h1.reduce((a, b) => a + b, 0) / h1.length;
    const mean2 = h2.reduce((a, b) => a + b, 0) / h2.length;

    // 상관계수 계산
    let numerator = 0;
    let denom1 = 0;
    let denom2 = 0;

    for (let i = 0; i < h1.length; i++) {
      const diff1 = h1[i] - mean1;
      const diff2 = h2[i] - mean2;
      numerator += diff1 * diff2;
      denom1 += diff1 * diff1;
      denom2 += diff2 * diff2;
    }

    const correlation = numerator / (Math.sqrt(denom1) * Math.sqrt(denom2) || 1);
    totalSimilarity += (correlation + 1) / 2 * 100; // -1~1을 0~100으로 변환
  }

  return totalSimilarity / 3;
}

// 그레이스케일 변환
function toGrayscale(data) {
  const gray = new Uint8ClampedArray(data.length / 4);
  for (let i = 0; i < data.length; i += 4) {
    gray[i / 4] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }
  return gray;
}

// 간단한 엣지 검출 (Sobel 유사)
function detectEdges(grayData, width, height) {
  const edges = new Uint8ClampedArray(grayData.length);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;

      // Sobel 커널 적용
      const gx =
        -grayData[idx - width - 1] + grayData[idx - width + 1] +
        -2 * grayData[idx - 1] + 2 * grayData[idx + 1] +
        -grayData[idx + width - 1] + grayData[idx + width + 1];

      const gy =
        -grayData[idx - width - 1] - 2 * grayData[idx - width] - grayData[idx - width + 1] +
        grayData[idx + width - 1] + 2 * grayData[idx + width] + grayData[idx + width + 1];

      edges[idx] = Math.min(255, Math.sqrt(gx * gx + gy * gy));
    }
  }

  return edges;
}

// 엣지 유사도 계산
function calculateEdgeSimilarity(edges1, edges2) {
  let totalDiff = 0;

  for (let i = 0; i < edges1.length; i++) {
    const diff = Math.abs(edges1[i] - edges2[i]);
    totalDiff += diff;
  }

  const avgDiff = totalDiff / edges1.length;
  const similarity = Math.max(0, 100 - (avgDiff / 255) * 100);
  return similarity;
}

// 구조적 유사도 (간단한 SSIM 유사 구현)
function calculateStructuralSimilarity(gray1, gray2, width, height) {
  const blockSize = 30;
  const blocksX = Math.floor(width / blockSize);
  const blocksY = Math.floor(height / blockSize);

  let totalSimilarity = 0;
  let blockCount = 0;

  for (let by = 0; by < blocksY; by++) {
    for (let bx = 0; bx < blocksX; bx++) {
      let sum1 = 0, sum2 = 0;
      let sq1 = 0, sq2 = 0;
      let cross = 0;
      let count = 0;

      for (let y = by * blockSize; y < (by + 1) * blockSize; y++) {
        for (let x = bx * blockSize; x < (bx + 1) * blockSize; x++) {
          const idx = y * width + x;
          const v1 = gray1[idx];
          const v2 = gray2[idx];

          sum1 += v1;
          sum2 += v2;
          sq1 += v1 * v1;
          sq2 += v2 * v2;
          cross += v1 * v2;
          count++;
        }
      }

      const mean1 = sum1 / count;
      const mean2 = sum2 / count;
      const var1 = sq1 / count - mean1 * mean1;
      const var2 = sq2 / count - mean2 * mean2;
      const covar = cross / count - mean1 * mean2;

      const c1 = 6.5025;
      const c2 = 58.5225;

      const ssim = ((2 * mean1 * mean2 + c1) * (2 * covar + c2)) /
                   ((mean1 * mean1 + mean2 * mean2 + c1) * (var1 + var2 + c2));

      totalSimilarity += (ssim + 1) / 2 * 100;
      blockCount++;
    }
  }

  return totalSimilarity / blockCount;
}

// 메인 비교 함수
export async function compareImages(referenceFile, targetFile) {
  const [refData, targetData] = await Promise.all([
    loadImageToCanvas(referenceFile),
    loadImageToCanvas(targetFile),
  ]);

  const refPixels = refData.imageData.data;
  const targetPixels = targetData.imageData.data;

  // 1. 픽셀 유사도 (25점)
  const pixelSimilarity = calculatePixelSimilarity(refPixels, targetPixels);

  // 2. 색상 히스토그램 유사도 (25점)
  const refHistogram = createColorHistogram(refPixels);
  const targetHistogram = createColorHistogram(targetPixels);
  const histogramSimilarity = calculateHistogramSimilarity(refHistogram, targetHistogram);

  // 3. 구조적 유사도 (25점)
  const refGray = toGrayscale(refPixels);
  const targetGray = toGrayscale(targetPixels);
  const structuralSimilarity = calculateStructuralSimilarity(
    refGray, targetGray, refData.width, refData.height
  );

  // 4. 엣지 유사도 (25점)
  const refEdges = detectEdges(refGray, refData.width, refData.height);
  const targetEdges = detectEdges(targetGray, targetData.width, targetData.height);
  const edgeSimilarity = calculateEdgeSimilarity(refEdges, targetEdges);

  // 각 항목을 25점 만점으로 환산
  const scores = {
    pixelSimilarity: {
      score: Math.round(pixelSimilarity * 0.25),
      maxScore: 25,
      percentage: pixelSimilarity,
      details: `픽셀 색상 일치율: ${pixelSimilarity.toFixed(1)}%`,
    },
    histogramSimilarity: {
      score: Math.round(histogramSimilarity * 0.25),
      maxScore: 25,
      percentage: histogramSimilarity,
      details: `색상 분포 유사도: ${histogramSimilarity.toFixed(1)}%`,
    },
    structuralSimilarity: {
      score: Math.round(structuralSimilarity * 0.25),
      maxScore: 25,
      percentage: structuralSimilarity,
      details: `구조적 유사도: ${structuralSimilarity.toFixed(1)}%`,
    },
    edgeSimilarity: {
      score: Math.round(edgeSimilarity * 0.25),
      maxScore: 25,
      percentage: edgeSimilarity,
      details: `윤곽선 유사도: ${edgeSimilarity.toFixed(1)}%`,
    },
  };

  const totalScore =
    scores.pixelSimilarity.score +
    scores.histogramSimilarity.score +
    scores.structuralSimilarity.score +
    scores.edgeSimilarity.score;

  return {
    totalScore,
    maxScore: 100,
    percentage: totalScore,
    breakdown: scores,
    referenceSize: { width: refData.originalWidth, height: refData.originalHeight },
    targetSize: { width: targetData.originalWidth, height: targetData.originalHeight },
  };
}

// 여러 이미지 비교
export async function compareMultipleImages(referenceFile, targetImages) {
  const results = await Promise.all(
    targetImages.map(async (target, index) => {
      try {
        const comparison = await compareImages(referenceFile, target.file);
        return {
          id: index + 1,
          name: target.name,
          ...comparison,
          previewUrl: target.previewUrl,
          error: null,
        };
      } catch (error) {
        return {
          id: index + 1,
          name: target.name,
          totalScore: 0,
          maxScore: 100,
          percentage: 0,
          breakdown: {},
          error: error.message,
        };
      }
    })
  );

  // 점수 순으로 정렬
  results.sort((a, b) => b.totalScore - a.totalScore);

  // 순위 부여
  results.forEach((result, index) => {
    result.rank = index + 1;
  });

  return {
    projects: results,
    comparedAt: new Date().toISOString(),
  };
}
