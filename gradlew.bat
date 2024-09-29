@echo off
setlocal
set "GRADLE_USER_HOME=%~dp0\.gradle"
set "JAVA_HOME=C:\Program Files\Java\jdk-17"  (or wherever your JDK is installed)
set "GRADLE_OPTS="
if not defined GRADLE_OPTS set "GRADLE_OPTS=-Dfile.encoding=UTF-8"
java -classpath "%~dp0\gradle\wrapper\gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain %*
endlocal
