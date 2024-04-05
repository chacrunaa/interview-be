import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Post } from "./posts.model";
import { FilesService } from "../files/files.service";

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
  ) {}

  async create(dto: CreatePostDto, image: any) {
    const post = await this.postRepository.create(dto);
    return post;
  }
  
  async findAll() {
    const posts = await this.postRepository.findAll();
    return posts;
  }


}
