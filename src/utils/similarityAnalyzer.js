import JSZip from 'jszip';

// 파일 확장자별 가중치
const FILE_WEIGHTS = {
  html: 1.5,
  css: 1.3,
  scss: 1.3,
  sass: 1.3,
  less: 1.3,
  js: 1.0,
  jsx: 1.0,
  ts: 1.0,
  tsx: 1.0,
  vue: 1.2,
  svelte: 1.2,
};

// 분석할 파일 확장자
const ANALYZABLE_EXTENSIONS = ['html', 'css', 'scss', 'sass', 'less', 'js', 'jsx', 'ts', 'tsx', 'vue', 'svelte'];

// ZIP 파일에서 프로젝트 파일 추출
export async function extractProjectFiles(zipFile) {
  const zip = await JSZip.loadAsync(zipFile);
  const files = {};

  const promises = [];

  zip.forEach((relativePath, zipEntry) => {
    if (!zipEntry.dir) {
      const ext = relativePath.split('.').pop().toLowerCase();
      if (ANALYZABLE_EXTENSIONS.includes(ext)) {
        promises.push(
          zipEntry.async('text').then(content => {
            files[relativePath] = {
              content,
              extension: ext,
              size: content.length,
            };
          })
        );
      }
    }
  });

  await Promise.all(promises);
  return files;
}

// 색상 추출 (CSS/스타일에서)
function extractColors(content) {
  const colors = new Set();

  // HEX 색상
  const hexPattern = /#([0-9a-fA-F]{3}){1,2}\b/g;
  const hexMatches = content.match(hexPattern) || [];
  hexMatches.forEach(c => colors.add(c.toLowerCase()));

  // RGB/RGBA 색상
  const rgbPattern = /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)/gi;
  const rgbMatches = content.match(rgbPattern) || [];
  rgbMatches.forEach(c => colors.add(c.toLowerCase().replace(/\s/g, '')));

  // HSL/HSLA 색상
  const hslPattern = /hsla?\s*\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*(,\s*[\d.]+)?\s*\)/gi;
  const hslMatches = content.match(hslPattern) || [];
  hslMatches.forEach(c => colors.add(c.toLowerCase().replace(/\s/g, '')));

  return Array.from(colors);
}

// 레이아웃 패턴 추출
function extractLayoutPatterns(content) {
  const patterns = {
    flexbox: (content.match(/display\s*:\s*flex/gi) || []).length,
    grid: (content.match(/display\s*:\s*grid/gi) || []).length,
    float: (content.match(/float\s*:\s*(left|right)/gi) || []).length,
    position: (content.match(/position\s*:\s*(absolute|relative|fixed)/gi) || []).length,
    margin: (content.match(/margin(-\w+)?\s*:/gi) || []).length,
    padding: (content.match(/padding(-\w+)?\s*:/gi) || []).length,
  };
  return patterns;
}

// HTML 구조 추출
function extractHTMLStructure(content) {
  const tags = {};
  const tagPattern = /<(\w+)[\s>]/g;
  let match;

  while ((match = tagPattern.exec(content)) !== null) {
    const tag = match[1].toLowerCase();
    tags[tag] = (tags[tag] || 0) + 1;
  }

  // 클래스명 추출
  const classPattern = /class\s*=\s*["']([^"']+)["']/gi;
  const classes = new Set();
  while ((match = classPattern.exec(content)) !== null) {
    match[1].split(/\s+/).forEach(c => classes.add(c));
  }

  return {
    tags,
    classCount: classes.size,
    classes: Array.from(classes),
  };
}

// 컴포넌트 구조 추출 (React/Vue 등)
function extractComponentStructure(content, extension) {
  const structure = {
    imports: [],
    exports: [],
    functions: [],
    hooks: [],
    stateVariables: [],
  };

  // import 문 추출
  const importPattern = /import\s+.+\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importPattern.exec(content)) !== null) {
    structure.imports.push(match[1]);
  }

  // React hooks 추출
  const hookPattern = /use[A-Z]\w+/g;
  const hooks = content.match(hookPattern) || [];
  structure.hooks = [...new Set(hooks)];

  // 함수 컴포넌트 추출
  const funcPattern = /(?:function|const|let|var)\s+(\w+)/g;
  while ((match = funcPattern.exec(content)) !== null) {
    structure.functions.push(match[1]);
  }

  // useState 변수 추출
  const statePattern = /const\s+\[(\w+),\s*set\w+\]/g;
  while ((match = statePattern.exec(content)) !== null) {
    structure.stateVariables.push(match[1]);
  }

  return structure;
}

// 두 배열의 Jaccard 유사도 계산
function jaccardSimilarity(arr1, arr2) {
  if (arr1.length === 0 && arr2.length === 0) return 1;
  if (arr1.length === 0 || arr2.length === 0) return 0;

  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

// 두 객체의 코사인 유사도 계산
function cosineSimilarity(obj1, obj2) {
  const keys = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])];

  if (keys.length === 0) return 1;

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  keys.forEach(key => {
    const v1 = obj1[key] || 0;
    const v2 = obj2[key] || 0;
    dotProduct += v1 * v2;
    norm1 += v1 * v1;
    norm2 += v2 * v2;
  });

  if (norm1 === 0 || norm2 === 0) return 0;

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// 프로젝트 분석
export function analyzeProject(files) {
  const analysis = {
    fileCount: Object.keys(files).length,
    totalSize: 0,
    colors: [],
    layoutPatterns: {
      flexbox: 0,
      grid: 0,
      float: 0,
      position: 0,
      margin: 0,
      padding: 0,
    },
    htmlStructure: {
      tags: {},
      classCount: 0,
      classes: [],
    },
    componentStructure: {
      imports: [],
      hooks: [],
      functions: [],
      stateVariables: [],
    },
    fileTypes: {},
  };

  Object.entries(files).forEach(([path, file]) => {
    analysis.totalSize += file.size;
    analysis.fileTypes[file.extension] = (analysis.fileTypes[file.extension] || 0) + 1;

    // CSS 파일에서 색상 및 레이아웃 추출
    if (['css', 'scss', 'sass', 'less'].includes(file.extension)) {
      analysis.colors.push(...extractColors(file.content));
      const layoutPatterns = extractLayoutPatterns(file.content);
      Object.entries(layoutPatterns).forEach(([key, value]) => {
        analysis.layoutPatterns[key] += value;
      });
    }

    // HTML 파일에서 구조 추출
    if (['html', 'vue', 'svelte'].includes(file.extension)) {
      const htmlStructure = extractHTMLStructure(file.content);
      Object.entries(htmlStructure.tags).forEach(([tag, count]) => {
        analysis.htmlStructure.tags[tag] = (analysis.htmlStructure.tags[tag] || 0) + count;
      });
      analysis.htmlStructure.classCount += htmlStructure.classCount;
      analysis.htmlStructure.classes.push(...htmlStructure.classes);
    }

    // JS/JSX/TS/TSX 파일에서 컴포넌트 구조 추출
    if (['js', 'jsx', 'ts', 'tsx'].includes(file.extension)) {
      // CSS-in-JS 색상 추출
      analysis.colors.push(...extractColors(file.content));

      const componentStructure = extractComponentStructure(file.content, file.extension);
      analysis.componentStructure.imports.push(...componentStructure.imports);
      analysis.componentStructure.hooks.push(...componentStructure.hooks);
      analysis.componentStructure.functions.push(...componentStructure.functions);
      analysis.componentStructure.stateVariables.push(...componentStructure.stateVariables);

      // JSX에서 HTML 구조 추출
      const htmlStructure = extractHTMLStructure(file.content);
      Object.entries(htmlStructure.tags).forEach(([tag, count]) => {
        analysis.htmlStructure.tags[tag] = (analysis.htmlStructure.tags[tag] || 0) + count;
      });
      analysis.htmlStructure.classCount += htmlStructure.classCount;
      analysis.htmlStructure.classes.push(...htmlStructure.classes);
    }
  });

  // 중복 제거
  analysis.colors = [...new Set(analysis.colors)];
  analysis.htmlStructure.classes = [...new Set(analysis.htmlStructure.classes)];
  analysis.componentStructure.imports = [...new Set(analysis.componentStructure.imports)];
  analysis.componentStructure.hooks = [...new Set(analysis.componentStructure.hooks)];

  return analysis;
}

// 기준 이미지에서 특징 추출 (간단한 메타데이터)
export function analyzeReferenceImage(imageFile) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      });
    };
    img.src = URL.createObjectURL(imageFile);
  });
}

// 유사도 계산
export function calculateSimilarity(referenceAnalysis, projectAnalysis) {
  const scores = {
    // 색상 유사도 (25점)
    colorSimilarity: {
      score: 0,
      maxScore: 25,
      details: '',
    },
    // 레이아웃 패턴 유사도 (25점)
    layoutSimilarity: {
      score: 0,
      maxScore: 25,
      details: '',
    },
    // HTML 구조 유사도 (25점)
    structureSimilarity: {
      score: 0,
      maxScore: 25,
      details: '',
    },
    // 컴포넌트 구성 유사도 (25점)
    componentSimilarity: {
      score: 0,
      maxScore: 25,
      details: '',
    },
  };

  // 색상 분석 점수 (프로젝트의 색상 다양성 기반)
  const colorCount = projectAnalysis.colors.length;
  if (colorCount >= 5) {
    scores.colorSimilarity.score = 25;
    scores.colorSimilarity.details = `${colorCount}개의 색상 정의 발견 (충분한 스타일링)`;
  } else if (colorCount >= 3) {
    scores.colorSimilarity.score = 20;
    scores.colorSimilarity.details = `${colorCount}개의 색상 정의 발견 (기본적인 스타일링)`;
  } else if (colorCount >= 1) {
    scores.colorSimilarity.score = 15;
    scores.colorSimilarity.details = `${colorCount}개의 색상 정의 발견 (최소한의 스타일링)`;
  } else {
    scores.colorSimilarity.score = 5;
    scores.colorSimilarity.details = '색상 정의가 거의 없음';
  }

  // 레이아웃 패턴 점수
  const layoutTotal = Object.values(projectAnalysis.layoutPatterns).reduce((a, b) => a + b, 0);
  const hasModernLayout = projectAnalysis.layoutPatterns.flexbox > 0 || projectAnalysis.layoutPatterns.grid > 0;

  if (layoutTotal >= 10 && hasModernLayout) {
    scores.layoutSimilarity.score = 25;
    scores.layoutSimilarity.details = `현대적 레이아웃 사용 (Flexbox: ${projectAnalysis.layoutPatterns.flexbox}, Grid: ${projectAnalysis.layoutPatterns.grid})`;
  } else if (layoutTotal >= 5) {
    scores.layoutSimilarity.score = 20;
    scores.layoutSimilarity.details = `적절한 레이아웃 패턴 사용 (총 ${layoutTotal}개 패턴)`;
  } else if (layoutTotal >= 1) {
    scores.layoutSimilarity.score = 15;
    scores.layoutSimilarity.details = `기본적인 레이아웃 패턴 사용 (총 ${layoutTotal}개 패턴)`;
  } else {
    scores.layoutSimilarity.score = 5;
    scores.layoutSimilarity.details = '레이아웃 패턴이 거의 없음';
  }

  // HTML 구조 점수
  const tagCount = Object.keys(projectAnalysis.htmlStructure.tags).length;
  const classCount = projectAnalysis.htmlStructure.classCount;

  if (tagCount >= 10 && classCount >= 10) {
    scores.structureSimilarity.score = 25;
    scores.structureSimilarity.details = `풍부한 HTML 구조 (${tagCount}종 태그, ${classCount}개 클래스)`;
  } else if (tagCount >= 5 && classCount >= 5) {
    scores.structureSimilarity.score = 20;
    scores.structureSimilarity.details = `적절한 HTML 구조 (${tagCount}종 태그, ${classCount}개 클래스)`;
  } else if (tagCount >= 1) {
    scores.structureSimilarity.score = 15;
    scores.structureSimilarity.details = `기본적인 HTML 구조 (${tagCount}종 태그, ${classCount}개 클래스)`;
  } else {
    scores.structureSimilarity.score = 5;
    scores.structureSimilarity.details = 'HTML 구조가 거의 없음';
  }

  // 컴포넌트 구성 점수
  const componentScore =
    projectAnalysis.componentStructure.imports.length * 2 +
    projectAnalysis.componentStructure.hooks.length * 3 +
    projectAnalysis.componentStructure.functions.length;

  if (componentScore >= 20) {
    scores.componentSimilarity.score = 25;
    scores.componentSimilarity.details = `잘 구성된 컴포넌트 구조 (${projectAnalysis.componentStructure.hooks.length}개 훅, ${projectAnalysis.componentStructure.functions.length}개 함수)`;
  } else if (componentScore >= 10) {
    scores.componentSimilarity.score = 20;
    scores.componentSimilarity.details = `적절한 컴포넌트 구조 (${projectAnalysis.componentStructure.hooks.length}개 훅, ${projectAnalysis.componentStructure.functions.length}개 함수)`;
  } else if (componentScore >= 1) {
    scores.componentSimilarity.score = 15;
    scores.componentSimilarity.details = `기본적인 컴포넌트 구조`;
  } else {
    scores.componentSimilarity.score = 5;
    scores.componentSimilarity.details = '컴포넌트 구조가 거의 없음';
  }

  // 총점 계산
  const totalScore =
    scores.colorSimilarity.score +
    scores.layoutSimilarity.score +
    scores.structureSimilarity.score +
    scores.componentSimilarity.score;

  return {
    totalScore,
    maxScore: 100,
    percentage: totalScore,
    breakdown: scores,
    analysis: projectAnalysis,
  };
}

// 여러 프로젝트 비교
export async function compareProjects(referenceImage, projectZips) {
  const referenceAnalysis = await analyzeReferenceImage(referenceImage);

  const results = await Promise.all(
    projectZips.map(async (zipFile, index) => {
      try {
        const files = await extractProjectFiles(zipFile.file);
        const projectAnalysis = analyzeProject(files);
        const similarity = calculateSimilarity(referenceAnalysis, projectAnalysis);

        return {
          id: index + 1,
          name: zipFile.name,
          ...similarity,
          error: null,
        };
      } catch (error) {
        return {
          id: index + 1,
          name: zipFile.name,
          totalScore: 0,
          maxScore: 100,
          percentage: 0,
          breakdown: {},
          analysis: null,
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
    referenceImage: {
      name: referenceImage.name,
      ...referenceAnalysis,
    },
    projects: results,
    comparedAt: new Date().toISOString(),
  };
}
