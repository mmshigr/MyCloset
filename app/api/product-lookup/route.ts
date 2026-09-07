import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const brand =
      typeof body.brand === "string" ? body.brand.trim() : ""

    const productNumber =
      typeof body.productNumber === "string"
        ? body.productNumber.trim()
        : ""

    if (!brand || !productNumber) {
      return NextResponse.json(
        { error: "ブランドと品番を入力してください" },
        { status: 400 },
      )
    }

    // --------------------------------
    // 1. Tavilyで商品情報を検索
    // --------------------------------

    const searchResponse = await fetch(
      "https://api.tavily.com/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: `${brand} ${productNumber}`,
          search_depth: "basic",
          max_results: 5,
        }),
      },
    )

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text()

      console.error(
        "Tavily search failed:",
        errorText,
      )

      return NextResponse.json(
        { error: "商品検索に失敗しました" },
        { status: 500 },
      )
    }

    const searchData = await searchResponse.json()

    if (
      !searchData.results ||
      searchData.results.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "商品情報が見つかりませんでした",
        },
        { status: 404 },
      )
    }

    console.log(
      "Tavily search results:",
      searchData.results,
    )

    // --------------------------------
    // 2. Tavilyの検索結果をGeminiに渡す
    // --------------------------------

    const sources = searchData.results
      .slice(0, 5)
      .map(
        (
          result: {
            title?: string
            url?: string
            content?: string
          },
          index: number,
        ) => {
          return `
【検索結果 ${index + 1}】

タイトル:
${result.title || ""}

URL:
${result.url || ""}

内容:
${result.content || ""}
`
        },
      )
      .join("\n")

    const prompt = `
あなたは衣類の商品情報を整理するアシスタントです。

ユーザーが入力した商品は以下です。

ブランド:
${brand}

品番:
${productNumber}

以下にWeb検索で取得した情報があります。

${sources}

重要なルール:

1. 上記のWeb検索結果だけを情報源として使用してください。
2. あなた自身の記憶や一般知識から商品情報を補完しないでください。
3. 品番が "${productNumber}" と一致する商品を優先してください。
4. ブランド名も一致していることを確認してください。
5. 公式ブランドサイトがある場合は公式情報を優先してください。
6. 公式サイトがない場合は、信頼できる正規取扱店の情報を優先してください。
7. 検索結果同士で情報が異なる場合、より信頼性の高い情報を優先してください。
8. 確認できない情報は推測しないでください。
9. 商品名は検索結果から確認できる正式な商品名を使用してください。
10. descriptionは検索結果から確認できる情報を簡潔に整理してください。
11. suggestedPriceは検索結果から確認できる販売価格を使用してください。
12. 商品価格が確認できない場合は0にしてください。
13. productUrlには、商品情報の根拠として最も適切なページのURLを入れてください。
14. imageは検索結果に画像URLが明確に存在する場合だけ設定してください。分からない場合は空文字にしてください。

categoryは必ず次のいずれか:
トップス / ボトムス / アウター / シューズ / アクセサリー

colorは必ず次のいずれか:
ホワイト / ブラック / グレー / ネイビー / ブルー / グリーン / ベージュ / ブラウン / イエロー / マルチ / その他

もし検索結果から商品を特定できない場合は、

name:
商品情報を確認できませんでした

としてください。

その場合でもcategoryとcolorは推測せず、
categoryは「トップス」、
colorは「その他」、
suggestedPriceは0、
productUrlは空文字、
imageは空文字
としてください。
`

    // --------------------------------
    // 3. Geminiで構造化JSONに変換
    // --------------------------------

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,

      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            category: {
              type: "string",
              enum: [
                "トップス",
                "ボトムス",
                "アウター",
                "シューズ",
                "アクセサリー",
              ],
            },
            color: {
              type: "string",
              enum: [
                "ホワイト",
                "ブラック",
                "グレー",
                "ネイビー",
                "ブルー",
                "グリーン",
                "ベージュ",
                "ブラウン",
                "イエロー",
                "マルチ",
                "その他",
              ],
            },
            description: {
              type: "string",
            },
            suggestedPrice: {
              type: "number",
            },
            productUrl: {
              type: "string",
            },
            image: {
              type: "string",
            },
          },
          required: [
            "name",
            "category",
            "color",
            "description",
            "suggestedPrice",
            "productUrl",
            "image",
          ],
        },
      },
    })

    const text = interaction.output_text

    if (!text) {
      return NextResponse.json(
        {
          error:
            "Geminiから商品情報を取得できませんでした",
        },
        { status: 404 },
      )
    }

    console.log(
      "Gemini structured response:",
      text,
    )

    const result = JSON.parse(text)

    // --------------------------------
    // 4. 結果をフロントへ返す
    // --------------------------------

    return NextResponse.json(result)
  } catch (error) {
    console.error(
      "Product lookup failed:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "商品情報の取得に失敗しました",
      },
      { status: 500 },
    )
  }
}