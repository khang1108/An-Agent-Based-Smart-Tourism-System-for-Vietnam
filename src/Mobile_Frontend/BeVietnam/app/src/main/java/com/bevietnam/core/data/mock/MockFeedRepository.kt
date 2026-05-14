package com.bevietnam.core.data.mock

import com.bevietnam.core.domain.repository.IFeedRepository
import com.bevietnam.core.model.FeedItem
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.delay

@Singleton
class MockFeedRepository @Inject constructor() : IFeedRepository {
    override fun getFeedItems(): Flow<List<FeedItem>> = flow {
        delay(1000)
        emit(listOf(
            FeedItem(
                id = "1",
                userId = "u1",
                userName = "Sơn Tùng M-TP",
                userAvatarUrl = "https://i.pravatar.cc/150?u=mtp",
                content = "Vừa ghé thăm Vịnh Hạ Long, vẻ đẹp thật hùng vĩ! 🌊 #BeVietnam #HaLong",
                imageUrl = "https://images.unsplash.com/photo-1524230572899-a752b3835840",
                timestamp = "2 giờ trước",
                likesCount = 1250,
                commentsCount = 45,
                location = "Vịnh Hạ Long, Quảng Ninh"
            ),
            FeedItem(
                id = "2",
                userId = "u2",
                userName = "H'Hen Niê",
                userAvatarUrl = "https://i.pravatar.cc/150?u=hhen",
                content = "Bún đậu mắm tôm Hà Nội luôn là chân ái. Ai đồng ý giơ tay nào! 🙋‍♀️",
                imageUrl = "https://images.unsplash.com/photo-1583212231107-dc3966c31ae1",
                timestamp = "5 giờ trước",
                likesCount = 890,
                commentsCount = 120,
                location = "Hoàn Kiếm, Hà Nội"
            )
        ))
    }
}