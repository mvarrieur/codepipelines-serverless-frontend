import { CodePipeline } from 'aws-sdk'
import { GetPipelineStateOutput, StageState } from 'aws-sdk/clients/codepipeline'

const codepipeline = new CodePipeline({ region: 'eu-central-1' })


export type JobStatus = 'InProgress' | 'Abandoned' | 'Succeeded' | 'Failed'
export class JobDto {
    name: string
    status: JobStatus
    timestamp: number
    executionId: string
}
export class PipelineDto {
  name: string
  jobs: JobDto[] = []
}

export async function getPipelineData(): Promise<PipelineDto[]> {
    const pipelines = await codepipeline.listPipelines().promise()
    return Promise.all(pipelines.pipelines.map(async pipeline => {
            const pipelineData: GetPipelineStateOutput = await codepipeline
              .getPipelineState({ name: pipeline.name }).promise()
            return toPipeline(pipelineData)
    }))
}

function toPipeline(pipelineResponse: GetPipelineStateOutput): PipelineDto {
    const pipelineData = new PipelineDto()
    pipelineData.name = pipelineResponse.pipelineName
    pipelineData.jobs = pipelineResponse.stageStates.map(job => toJob(job))
    return pipelineData
}

function toJob(job: StageState): JobDto {
    const jobData = new JobDto()
    jobData.name = job.stageName
    jobData.executionId = job.latestExecution?.pipelineExecutionId
    jobData.status = job.latestExecution?.status as JobStatus
    jobData.timestamp = job.actionStates?.pop()?.latestExecution?.lastStatusChange?.getTime()
    return jobData
}