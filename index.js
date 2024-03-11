#! /usr/bin/env node

const { program } = require('commander')
const inquirer = require('inquirer')
const ora = require('ora')
const figlet = require('figlet')
const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const fetch = require('node-fetch')
const git = require('simple-git')
const { exec } = require('child_process')

// figlet("L O O N G - C L I", (err, data) => {
//     console.log(data)
// })

program
    .name('loong-cli').usage('<command>')
    .description('基于Webpack的，搭建前端项目的一个脚手架')
    .version(require('./package.json').version)

program
    .command('create <app-name>')
    .description('创建一个新项目')
    .action(async (name) => {
        const owner = 'LoveEmiliaForever'
        const repo = 'loong-cli-template'
        let templateNames = []
        const targetPath = path.join(process.cwd(), name)
        if (fs.existsSync(targetPath)) {
            const rewriteConfirm = await inquirer.prompt([
                {
                    type: 'list',
                    message: `已存在目录：${targetPath}\n是否将其覆盖？`,
                    name: 'overwrite',
                    choices: [
                        {
                            name: '确认覆盖',
                            value: true
                        },
                        {
                            name: '不覆盖',
                            value: false
                        }
                    ]
                }
            ])
            // 项目文件夹操作
            if (rewriteConfirm.overwrite) {
                const deletFoldTip = ora('正在删除原文件夹...').start()
                deletFoldTip.color = 'red'
                await fs.remove(targetPath)
                    .then(async () => {
                        deletFoldTip.succeed(chalk.red.strikethrough(`已删除原文件夹：${chalk.bold(targetPath)}`))
                        await fs.ensureDir(targetPath)
                            .then(() => { ora(chalk.green(`成功创建项目文件夹：${chalk.bold(targetPath)}`)).succeed() })
                    })
                    .catch((err) => { deletFoldTip.fail(chalk.white.bgRed(`出现错误：${err}`)) })
            } else {
                return
            }
        } else {
            await fs.ensureDir(targetPath)
                .then(() => { ora(chalk.green(`成功创建项目文件夹：${chalk.bold(targetPath)}`)).succeed() })
                .catch((err) => { ora(chalk.white.bgRed(`出现错误：${err}`)).fail(); return })
        }

        const templateUseTip = await inquirer.prompt([
            {
                type: 'list',
                message: '是否使用已设定好的模板？',
                name: 'templateUseFlag',
                choices: [
                    {
                        name: '使用',
                        value: true
                    },
                    {
                        name: '不使用',
                        value: false
                    }
                ]
            }
        ])
        if (templateUseTip.templateUseFlag) {
            let getTemplate = ora('正在获取模板...').start()
            getTemplate.color = 'green'
            await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`)
                .then(response => response.json())
                .then(branches => {
                    for (const branch of branches) {
                        if (!branch.name.includes('singleFile')) {
                            templateNames.push({
                                name: `${branch.name}`,
                                value: `${branch.name}`
                            })
                        }
                    }
                    getTemplate.succeed(chalk.green('模板获取成功'))
                })
                .catch(err => { getTemplate.fail(chalk.white.bgRed(`出现错误：${err}`)); return })
            const selectedTemplate = await inquirer.prompt([
                {
                    type: 'list',
                    message: '选择下列哪个模板创建项目？',
                    name: 'template',
                    choices: templateNames
                }
            ])
            getTemplate = ora(chalk.green('下载模板中...')).start()
            getTemplate.color = 'green'
            git().clone(`https://github.com/${owner}/${repo}.git`, targetPath, ['-b', selectedTemplate.template])
                .then(() => {
                    getTemplate.succeed(chalk.green('模板下载成功'))
                    const getNpmDependencies = ora('安装依赖中...').start()
                    getNpmDependencies.color = 'green'
                    exec(`npm install`, { cwd:`${targetPath}` }, (err, stdout, stderr) => {
                        if (err) {
                            console.log(chalk.white.bgRed(`出现错误：${err}`))
                        }
                        getNpmDependencies.succeed(chalk.green('依赖已安装完成'))
                        fs.remove(path.join(targetPath, '.git'))
                        fs.remove(path.join(targetPath, '.gitignore'))
                        console.log(chalk.white.bgGreen('项目创建完成'))
                    })
                })
                .catch(err => { getTemplate.fail(chalk.white.bgRed(`出现错误：${err}`)); return })
            return
        }

        const answer = await inquirer.prompt([
            {
                type: 'list',
                message: '使用什么框架？',
                name: 'frame',
                choices: [
                    {
                        name: 'Vue',
                        value: 'Vue'
                    }
                ]
            }
        ])
    })

program.parse(process.argv)
