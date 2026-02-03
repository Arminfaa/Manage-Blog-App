'use server';

import { revalidateTag } from 'next/cache';

export async function revalidatePosts() {
  revalidateTag('posts');
}

export async function revalidateCategories() {
  revalidateTag('categories');
}

export async function revalidateComments() {
  revalidateTag('comments');
}

export async function revalidateUsers() {
  revalidateTag('users');
}

export async function revalidateUser() {
  revalidateTag('user');
}
