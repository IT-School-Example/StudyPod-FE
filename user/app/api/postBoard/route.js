import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();

    const filePath = path.join(process.cwd(), 'public', 'boardData.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const boardList = JSON.parse(fileData);

    // 새 board_id 생성 (가장 큰 id + 1)
    const maxId = boardList.reduce((max, item) => Math.max(max, item.board_id), 0);
    const newBoardId = maxId + 1;

    const newPost = {
      board_id: newBoardId,
      category: body.category || 'free',
      title: body.title,
      content: body.content,
      study_group_detail: body.study_group_detail,
      user_id: body.user_id || 'unknown',
      views: 0,
      date: new Date().toISOString().split('T')[0],
      comments: []
    };

    boardList.push(newPost);
    await fs.writeFile(filePath, JSON.stringify(boardList, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true, post: newPost }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error writing post:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
