const gulp = require('gulp')
const clean = require('gulp-clean')
const ts = require('gulp-typescript')

//Cria um projeto baseado no arquivo tsconfig.json
const tsProject = ts.createProject('tsconfig.json')

//task cria nova tarefa no gulp
gulp.task('scripts', ['static'], () => {

  //pipe realiza uma operação no codigo fonte TS.
  const tsResult = tsProject.src()
    .pipe(tsProject())

  //Manda o codigo compilado para pasta dist.
  return tsResult.js
    .pipe(gulp.dest('dist'))
})

//Envia os arquivos .json para dist
gulp.task('static', ['clean'], () => {
  return gulp
    .src(['src/**/*.json'])
    .pipe(gulp.dest('dist'))
})

//Realiza limpeza na pasta dist caso algum arquivo em src seja excluido.
gulp.task('clean', () => {
  return gulp 
    .src('dist')
    .pipe(clean())
})

//Realiza as tarefas em sequência por conta da dependencia passada no segundo parâmetro das tasks. 
gulp.task('build', ['scripts'])

//Toda alteração em src será ouvida, executando em seguida a task build.
gulp.task('watch', ['build'], () => {
  return gulp
    .watch(['src/**/*.ts', 'src/**/*.json'], ['build'])
})

gulp.task('default', ['watch'])