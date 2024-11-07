import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { LevelJSON } from "@/lib/game/level";

export async function POST(req: NextRequest) {
    const body = await req.json();
    //Not type checking allat until after college apps are done. "I'm tired of fighting with typescript. I'll do it later." - continune autofill. Continue is so fun.


    const { levelJSON }: {
        levelJSON: LevelJSON
    } = body;

    console.log(levelJSON);
    const oldLevel = await prisma.level.findFirst({
        where:
        {
            AND: [
                {
                    index: levelJSON.index
                },
                {
                    adventureName: levelJSON.adventureName
                }
            ]
        }
    });

    if (oldLevel) {
        await prisma.level.deleteMany({ where: { index: levelJSON.index } });
    }

    const tileList = [];

    for (const tile of levelJSON.tiles) {

        const newTile = await prisma.tile.create({
            data: {
                type: tile.type,
                index: tile.index,
                texture: tile.texture,
                entities: {
                    create: [
                        ...tile.entities
                    ]
                }
            }
        });
        if (tile.structure) {
            const newStructure = await prisma.structure.create({
                data: {
                    texture: tile.structure.texture,
                    treeType: tile.structure.treeType,
                    tile: {
                        connect: { id: newTile.id }
                    }
                }
            })
        }
        tileList.push({ id: newTile.id });
    }

    const level = await prisma.level.create({
        data: {
            dimensions: levelJSON.dimensions,
            index: levelJSON.index,
            tiles: {
                connect: tileList,
            },
            mainCoords: levelJSON.mainCoords,
            winCon: levelJSON.winCon,
            adventureName: levelJSON.adventureName
        }
    });

    return NextResponse.json({ level }, { status: 201 });

}