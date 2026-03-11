import JSZip from 'jszip';

// 지원하는 코드 파일 확장자
const CODE_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
  '.py', '.java', '.c', '.cpp', '.h', '.hpp',
  '.cs', '.go', '.rb', '.php', '.swift', '.kt',
  '.html', '.css', '.scss', '.sass', '.less'
];

// 파일이 코드 파일인지 확인
function isCodeFile(filename) {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return CODE_EXTENSIONS.includes(ext);
}

// 제외할 폴더
function shouldExclude(path) {
  const excludePatterns = [
    'node_modules', '.git', 'dist', 'build', 'coverage',
    '__pycache__', '.next', '.nuxt', 'vendor', '.idea', '.vscode'
  ];
  return excludePatterns.some(pattern => path.includes(pattern));
}

// LOC (Lines of Code) 계산
function calculateLOC(content) {
  const lines = content.split('\n');
  let totalLines = lines.length;
  let codeLines = 0;
  let commentLines = 0;
  let blankLines = 0;

  let inBlockComment = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      blankLines++;
      continue;
    }

    // 블록 주석 처리
    if (inBlockComment) {
      commentLines++;
      if (trimmed.includes('*/')) {
        inBlockComment = false;
      }
      continue;
    }

    if (trimmed.startsWith('/*')) {
      commentLines++;
      if (!trimmed.includes('*/')) {
        inBlockComment = true;
      }
      continue;
    }

    // 한 줄 주석
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('<!--')) {
      commentLines++;
      continue;
    }

    codeLines++;
  }

  return { totalLines, codeLines, commentLines, blankLines };
}

// Cyclomatic Complexity 계산 (간단한 버전)
function calculateCyclomaticComplexity(content) {
  // 결정 포인트 패턴
  const patterns = [
    /\bif\s*\(/g,
    /\belse\s+if\s*\(/g,
    /\bfor\s*\(/g,
    /\bwhile\s*\(/g,
    /\bcase\s+/g,
    /\bcatch\s*\(/g,
    /\b\?\s*[^:]+:/g, // 삼항 연산자
    /&&/g,
    /\|\|/g,
  ];

  let complexity = 1; // 기본 복잡도

  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      complexity += matches.length;
    }
  }

  return complexity;
}

// 함수 개수 계산
function countFunctions(content) {
  const patterns = [
    /function\s+\w+\s*\(/g,           // function declaration
    /function\s*\(/g,                  // anonymous function
    /\w+\s*=\s*function/g,            // function expression
    /\w+\s*=\s*\([^)]*\)\s*=>/g,      // arrow function
    /\w+\s*=\s*async\s*\([^)]*\)\s*=>/g, // async arrow
    /async\s+function/g,               // async function
    /def\s+\w+\s*\(/g,                // Python function
    /public\s+\w+\s+\w+\s*\(/g,       // Java/C# method
    /private\s+\w+\s+\w+\s*\(/g,
    /protected\s+\w+\s+\w+\s*\(/g,
  ];

  let count = 0;
  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      count += matches.length;
    }
  }

  return count;
}

// 클래스 개수 계산
function countClasses(content) {
  const patterns = [
    /\bclass\s+\w+/g,
    /\binterface\s+\w+/g,
    /\benum\s+\w+/g,
  ];

  let count = 0;
  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      count += matches.length;
    }
  }

  return count;
}

// Import/의존성 계산 (CBO - Coupling Between Objects 근사치)
function countDependencies(content) {
  const patterns = [
    /\bimport\s+/g,
    /\brequire\s*\(/g,
    /\bfrom\s+['"][^'"]+['"]/g,
  ];

  let count = 0;
  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      count += matches.length;
    }
  }

  return count;
}

// 단일 파일 분석
function analyzeFile(content, filename) {
  const loc = calculateLOC(content);
  const complexity = calculateCyclomaticComplexity(content);
  const functions = countFunctions(content);
  const classes = countClasses(content);
  const dependencies = countDependencies(content);

  return {
    filename,
    loc,
    complexity,
    functions,
    classes,
    dependencies,
  };
}

// ZIP 파일에서 프로젝트 분석
export async function analyzeProjectQuality(zipFile) {
  const zip = await JSZip.loadAsync(zipFile);
  const files = [];
  const fileAnalyses = [];

  // 모든 코드 파일 찾기
  for (const [path, file] of Object.entries(zip.files)) {
    if (file.dir || shouldExclude(path) || !isCodeFile(path)) {
      continue;
    }
    files.push({ path, file });
  }

  // 각 파일 분석
  for (const { path, file } of files) {
    try {
      const content = await file.async('text');
      const analysis = analyzeFile(content, path);
      fileAnalyses.push(analysis);
    } catch (e) {
      console.warn(`파일 분석 실패: ${path}`, e);
    }
  }

  // 전체 통계 계산
  const totalLOC = fileAnalyses.reduce((sum, f) => sum + f.loc.codeLines, 0);
  const totalComplexity = fileAnalyses.reduce((sum, f) => sum + f.complexity, 0);
  const totalFunctions = fileAnalyses.reduce((sum, f) => sum + f.functions, 0);
  const totalClasses = fileAnalyses.reduce((sum, f) => sum + f.classes, 0);
  const totalDependencies = fileAnalyses.reduce((sum, f) => sum + f.dependencies, 0);

  // 평균 계산
  const fileCount = fileAnalyses.length || 1;
  const avgComplexity = totalFunctions > 0
    ? (totalComplexity / totalFunctions).toFixed(2)
    : 0;
  const avgCBO = (totalDependencies / fileCount).toFixed(1);

  return {
    summary: {
      totalLOC,
      totalFiles: fileCount,
      totalFunctions,
      totalClasses,
      avgCyclomaticComplexity: parseFloat(avgComplexity),
      avgCBO: parseFloat(avgCBO),
      totalDependencies,
    },
    files: fileAnalyses,
  };
}

// 여러 프로젝트 품질 비교
export async function compareProjectsQuality(projects) {
  const results = [];

  for (const project of projects) {
    try {
      const analysis = await analyzeProjectQuality(project.file);
      results.push({
        id: project.id,
        name: project.name,
        ...analysis,
        error: null,
      });
    } catch (error) {
      results.push({
        id: project.id,
        name: project.name,
        summary: null,
        files: [],
        error: error.message,
      });
    }
  }

  return {
    projects: results,
    comparedAt: new Date().toISOString(),
  };
}
