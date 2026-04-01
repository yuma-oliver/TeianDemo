# API設計（簡易版）

## 1. 抽出処理API
- **エンドポイント**: `POST /api/extract`
- **概要**: アップロードされたCSVを解析し、S3上のファイルとマッチングを行う。
- **リクエスト**:
  - `multipart/form-data` 形式
  - `file`: CSVファイル
  - `prefix`: S3検索用プレフィックス（任意）
- **レスポンス**:
  - `200 OK`
  - Body: JSON形式
    - `matchedFiles`: マッチしたファイル情報の配列
    - `unmatched`: 見つからなかった品番の配列
    - `duplicates`: 重複して見つかったファイル情報の配列

## 2. PDFマージAPI
- **エンドポイント**: `POST /api/merge-pdf`
- **概要**: 抽出されたPDFファイル群を1つのPDFファイルに結合する。
- **リクエスト**: JSON
  - `fileKeys`: マージ対象のS3ファイルキーの配列
- **レスポンス**:
  - `200 OK`
  - Body: マージされたPDFファイルのバイナリストリーム（`application/pdf`）

## 3. PPTXマージAPI
- **エンドポイント**: `POST /api/merge-pptx`
- **概要**: 抽出されたPPTXファイル群を1つのPPTXファイルに結合する。
- **リクエスト**: JSON
  - `fileKeys`: マージ対象のS3ファイルキーの配列
- **レスポンス**:
  - `200 OK`
  - Body: マージされたPPTXファイルのバイナリストリーム（`application/vnd.openxmlformats-officedocument.presentationml.presentation`）

## 4. 見積もりプレビューAPI
- **エンドポイント**: `POST /api/estimate-preview`
- **概要**: CSVデータとマッチング結果から、画面表示用に見積もりの全体プレビューデータを生成して返す。
- **リクエスト**: JSON（抽出結果データ）
- **レスポンス**: JSON（プレビュー用整形データ）
