import Display from "./display";



export default async function GameTest({ params }: { params: { levelNumber: string, adventureName: string } }) {




    return (
        <>
            <Display oldLevelNumber={params.levelNumber} adventureName={params.adventureName} />



            {/* <GameDisplay levelNumber={params.levelNumber} />
            <Workspace /> */}
        </>
    )
}